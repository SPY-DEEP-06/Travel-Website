(function (root, factory) {
    root.SlowScroll = factory();
})(typeof window !== 'undefined' ? window : this, function () {
    'use strict';

    const defaults = {
        target: 'body',
        interpolationTarget: null,
        speed: 30,
        interpolation: true,
        bounce: false,
        isHorizontal: false,
        autoplay: true,
        pauseOnTouch: false,
        pauseOnMouseMove: false,
        userScrollResumeDelay: 100,
        onDirectionChange: null,
        onBoundaryReached: null
    };

    const resolveElement = (target) => {
        if (!target) return document.body;
        if (typeof target === 'string') return document.querySelector(target) || document.body;
        return target;
    };

    class SlowScrollController {
        constructor(options = {}) {
            this.config = Object.assign({}, defaults, options);
            this.target = resolveElement(this.config.target);
            this.interpolationTarget = resolveElement(this.config.interpolationTarget) || this.target;
            this.running = false;
            this.frame = null;
            this.animationFrame = null;
            this.motionTarget = null;
            this.motionEase = 0.24;
            this.lastTime = 0;
            this.lastInteraction = 0;
            this.direction = this.config.speed >= 0 ? 'down' : 'up';
            this.isWindowTarget = this.target === document.body || this.target === document.documentElement;
            this.handleTouch = this.handleTouch.bind(this);
            this.handleMouseMove = this.handleMouseMove.bind(this);
            this.tick = this.tick.bind(this);
            this.bindInteractionPauses();

            if (this.config.autoplay) {
                this.start();
            }
        }

        bindInteractionPauses() {
            if (this.config.pauseOnTouch) {
                window.addEventListener('touchstart', this.handleTouch, { passive: true });
            }

            if (this.config.pauseOnMouseMove) {
                window.addEventListener('mousemove', this.handleMouseMove, { passive: true });
            }
        }

        handleTouch() {
            this.lastInteraction = performance.now();
        }

        handleMouseMove() {
            this.lastInteraction = performance.now();
        }

        getPosition() {
            if (this.isWindowTarget) {
                return this.config.isHorizontal ? window.scrollX : window.scrollY;
            }

            return this.config.isHorizontal ? this.target.scrollLeft : this.target.scrollTop;
        }

        getMaxPosition() {
            if (this.isWindowTarget) {
                const doc = document.documentElement;
                const body = document.body;
                return this.config.isHorizontal
                    ? Math.max(0, Math.max(doc.scrollWidth, body ? body.scrollWidth : 0) - window.innerWidth)
                    : Math.max(0, Math.max(doc.scrollHeight, body ? body.scrollHeight : 0) - window.innerHeight);
            }

            return this.config.isHorizontal
                ? Math.max(0, this.target.scrollWidth - this.target.clientWidth)
                : Math.max(0, this.target.scrollHeight - this.target.clientHeight);
        }

        scrollBy(amount) {
            if (this.isWindowTarget) {
                window.scrollBy(this.config.isHorizontal ? amount : 0, this.config.isHorizontal ? 0 : amount);
                return;
            }

            if (this.config.isHorizontal) {
                this.target.scrollLeft += amount;
            } else {
                this.target.scrollTop += amount;
            }
        }

        setInterpolation(amount) {
            if (!this.config.interpolation || !this.interpolationTarget) return;
            const visualOffset = Math.max(-1, Math.min(1, -amount * 0.18));
            const axis = this.config.isHorizontal ? 'X' : 'Y';
            this.interpolationTarget.style.transform = `translate${axis}(${visualOffset}px)`;
        }

        clearInterpolation() {
            if (this.interpolationTarget) {
                this.interpolationTarget.style.transform = '';
            }
        }

        setPosition(position) {
            if (this.isWindowTarget) {
                window.scrollTo(
                    this.config.isHorizontal ? position : window.scrollX,
                    this.config.isHorizontal ? window.scrollY : position
                );
                return;
            }

            if (this.config.isHorizontal) {
                this.target.scrollLeft = position;
            } else {
                this.target.scrollTop = position;
            }
        }

        cancelSmoothMotion() {
            if (this.animationFrame) {
                cancelAnimationFrame(this.animationFrame);
            }
            this.animationFrame = null;
            this.clearInterpolation();
        }

        smoothTo(position, options = {}) {
            const max = this.getMaxPosition();
            const duration = options.duration || 900;
            this.motionTarget = Math.min(Math.max(position, 0), max);
            this.motionEase = Math.min(.34, Math.max(.18, 220 / duration));

            if (Math.abs(this.motionTarget - this.getPosition()) < 1) {
                this.setPosition(this.motionTarget);
                this.clearInterpolation();
                return;
            }

            if (this.animationFrame) return;

            const step = () => {
                const current = this.getPosition();
                const distance = this.motionTarget - current;

                if (Math.abs(distance) < 2) {
                    this.setPosition(this.motionTarget);
                    this.animationFrame = null;
                    this.clearInterpolation();
                    return;
                }

                const nextPosition = current + distance * this.motionEase;
                this.setPosition(nextPosition);
                this.setInterpolation(nextPosition - current);
                this.animationFrame = requestAnimationFrame(step);
            };

            this.animationFrame = requestAnimationFrame(step);
        }

        scrollBySmooth(amount, options = {}) {
            this.smoothTo(this.getPosition() + amount, options);
        }

        tick(now) {
            if (!this.running) return;

            const paused = now - this.lastInteraction < this.config.userScrollResumeDelay;
            const elapsed = Math.min(64, now - this.lastTime);
            this.lastTime = now;

            if (!paused) {
                const amount = this.config.speed * elapsed / 1000;
                const current = this.getPosition();
                const max = this.getMaxPosition();
                const next = current + amount;
                const hitStart = next <= 0 && amount < 0;
                const hitEnd = next >= max && amount > 0;

                if (hitStart || hitEnd) {
                    if (this.config.bounce) {
                        this.config.speed *= -1;
                        const nextDirection = this.config.speed >= 0 ? 'down' : 'up';
                        if (nextDirection !== this.direction && typeof this.config.onDirectionChange === 'function') {
                            this.config.onDirectionChange(nextDirection);
                        }
                        this.direction = nextDirection;
                    } else {
                        if (typeof this.config.onBoundaryReached === 'function') {
                            this.config.onBoundaryReached(hitStart ? 'top' : 'bottom');
                        }
                        this.stop();
                        return;
                    }
                } else {
                    this.scrollBy(amount);
                    this.setInterpolation(amount);
                }
            }

            this.frame = requestAnimationFrame(this.tick);
        }

        start() {
            if (this.running) return;
            this.running = true;
            this.lastTime = performance.now();
            this.frame = requestAnimationFrame(this.tick);
        }

        stop() {
            this.running = false;
            if (this.frame) {
                cancelAnimationFrame(this.frame);
            }
            this.cancelSmoothMotion();
            this.frame = null;
            this.clearInterpolation();
        }

        setSpeed(newSpeed) {
            this.config.speed = Number(newSpeed) || 0;
            const nextDirection = this.config.speed >= 0 ? 'down' : 'up';
            if (nextDirection !== this.direction && typeof this.config.onDirectionChange === 'function') {
                this.config.onDirectionChange(nextDirection);
            }
            this.direction = nextDirection;
            if (!this.running) {
                this.start();
            }
        }

        isRunning() {
            return this.running;
        }

        getConfig() {
            return Object.assign({}, this.config);
        }
    }

    return {
        createSlowScroll(options) {
            return new SlowScrollController(options);
        }
    };
});
