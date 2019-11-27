import Vue from 'vue';

window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();
function swipeLeft(el, binding) {
    const _this = this
    this._init(el, binding);
    //this.handleCallBack = typeof (binding.value) === "object" ? binding.value.fn : binding.value;   
    this.$el.addEventListener("touchstart", function (e) {
        _this.start(e, el, binding)
    }, false)
    this.$el.addEventListener("touchmove", function (e) {
        _this.move(e, el, binding)
    }, false)
    this.$el.addEventListener("touchend", function (e) {
        _this.end(e, el, binding)
    }, false)
    // binding.value.parentNode
}

swipeLeft.prototype = {
    _init(el, binding) {
        this.$el = el;
        this.$el.style.WebkitTransform = 'translateX(0px)'

        this.initX = 0 // 触摸位置X
        this.initY = 0 // 触摸位置Y
        this.absX = 0 // X方向的绝对位置
        this.absY = 0 // Y方向的绝对位置
        this.tempX = 0 // 上一次移动的X位置
        this.tempY = 0 // 上一次移动的Y位置
        this.moveX = 0 // 滑动时的位置
        this.moveToX = 0 // 目标对象位置
        this.ismoving = false

        this.childNode = null
        this.widthNode = null
        this.moveDistance = 0
    },
    _setChildWidth(width) {
        // width = '320';
        this.childNode.style.width = width + 'px';
        this.childNode.style.right = -width + 'px';
    },
    //重新设置每个明细行的transform的距离
    resetSiblings() {
        let className = this.$el.className;
        let siblings = document.querySelectorAll(`.${className}`)
        siblings.forEach((el, i)=>{
            if(el !== this.$el) {
                el.style.WebkitTransform = 'translateX(0px)'
            }
        })
    },
    resetAll () {
        let className = this.$el.className;
        let siblings = document.querySelectorAll(`.${className}`)
        siblings.forEach((el, i) => {
            // if (el !== this.$el) {
                el.style.WebkitTransform = 'translateX(0px)'
            // }
        })
    },
    /**
     * 开始触摸是记录当前位置
     */
    start: function(e, el, binding) {
        const targetTouches = e.touches[0];

        this.initX = targetTouches.clientX;
        this.initY = targetTouches.clientY;
        this.tempX = this.initX
        this.tempY = this.initY
        this.moveToX = (this.$el.style.WebkitTransform.replace(/translateX\(/g, "").replace(/px\)/g, "")) * 1;
        
        this.childNode = this.$el.querySelector(binding.value.node);
        this.widthNode = this.$el.querySelector(binding.value.widthNode);
        this.parentNode = document.querySelector(binding.value.parentNode);

        this.moveDistance = this.$el.offsetWidth * 40 / 100;//this.widthNode.offsetWidth;
        this.$el.style.transition = "unset";
        this.childNode.style.transition = "unset";
        this.ismoving = false
        this.resetSiblings();
    },
    /**
     * 开始移动记录位置
     */
    move: function(e) {
        const targetTouches = e.touches[0];
        
        this.moveX = targetTouches.clientX - this.initX;
        this.moveY = targetTouches.clientY - this.initY;
        this.absX = this.absX + Math.abs(Math.abs(targetTouches.clientX) - Math.abs(this.tempX))
        this.tempX = targetTouches.clientX

        this.absY = this.absY + Math.abs(Math.abs(targetTouches.clientY) - Math.abs(this.tempY))
        this.tempY = targetTouches.clientY

        this.$el.style.transition = 'unset';
        // 限制了左右滑动的时候页面上下滚动
        let sideL = Math.sqrt(this.moveX * this.moveX + this.moveY * this.moveY);
        if (Math.abs(this.moveY) / sideL < 1 / 2) {
            if (!this.ismoving) {
                if (this.absY > this.absX) {
                    this.parentNode.style['overflowY'] = "auto";
                    Vue.prototype.$eventBus.$emit('isLeftMoving', false)
                    return false
                } else {
                    console.log(this.ismoving, '左移')
                    // 注意,因为 y 移动距离过小,所以这样设置, 为了防止左右滑动时,列表上下有轻微滑动
                    this.parentNode.style['overflowY'] = "hidden";
                    Vue.prototype.$eventBus.$emit('isLeftMoving', true)
                }
            } else {
                this.parentNode.style['overflowY'] = "hidden";
                Vue.prototype.$eventBus.$emit('isLeftMoving', true)
            }
        } else {
            // 解决滚动时左滑太灵敏的问题
            if (!this.ismoving) {
                this.parentNode.style['overflowY'] = "auto";
                Vue.prototype.$eventBus.$emit('isLeftMoving', false)
                return false
            } else {
                console.log('x>y')
                // 避免上下滑动时闪回
                this.parentNode.style['overflowY'] = "hidden";
                Vue.prototype.$eventBus.$emit('isLeftMoving', true)
                // this.resetAll()
            }
        }
        if (this.moveToX == 0) {
            this.ismoving = true

            console.log('设置', this.ismoving)
            // 说明从最左边开始
            if (this.moveX >= 0) {
                requestAnimationFrame(() => {
                    // 向右划保持不动
                    this.$el.style.WebkitTransform = "translateX(" + 0 + "px)";

                })
            } else if (this.moveX < 0) {
                requestAnimationFrame(() => {
                    // 向左划
                    let moveLeft = Math.abs(this.moveX);
                    this.$el.style.WebkitTransform = "translateX(" + -moveLeft + "px)";
                    if (moveLeft > this.moveDistance) { //手滑动的距离大于按钮的长度，则按钮显示
                        moveLeft = this.moveDistance + moveLeft / 10;
                        this._setChildWidth(Math.abs(moveLeft))
                        this.$el.style.WebkitTransform = "translateX(" + -moveLeft + "px)";
                    }
                });
            }
        } else if (this.moveToX < 0) {
            this.ismoving = true
            requestAnimationFrame (() => {
                if (this.moveX >= 0) {
                    let moveRight = -this.moveDistance + Math.abs(this.moveX);
                    this.$el.style.WebkitTransform = "translateX(" + moveRight + "px)";
                    if (moveRight > 0) {
                        moveRight = 0;
                        this.$el.style.WebkitTransform = "translateX(" + moveRight + "px)";
                    }
                } else { //向左滑动
                    let moveRight = -this.moveDistance;
                    moveRight += this.moveX / 10
                    this._setChildWidth(Math.abs(moveRight)) // 弹性滑动
                    this.$el.style.WebkitTransform = "translateX(" + moveRight + "px)";
                }
            })
        }
    },
    end: function(e, el, binding) {
        this.ismoving = false
            requestAnimationFrame(() => {
                this.moveToX = (this.$el.style.WebkitTransform.replace(/translateX\(/g, "").replace(/px\)/g, "")) * 1;
                if (this.moveToX > -this.moveDistance / 2) {
                    // 滑动不到一半， 则不显示
                    this.$el.style.WebkitTransform = "translateX(" + 0 + "px)";
                    this.$el.style.transition = ".4s ease all";
                    this.moveToX = 0;
                } else {
                    this.$el.style.WebkitTransform = "translateX(" + -this.moveDistance + "px)";
                    this.moveToX = -this.moveDistance;
                }


                this.childNode.style.width = this.moveDistance + 'px';
                this.childNode.style.right = -this.moveDistance + 'px';

                this.$el.style.transition = ".4s ease all";
                this.childNode.style.transition = ".4s ease all";

                this.moveX = 0;
                this.moveY = 0;

                this.absX = 0
                this.absY = 0
                // 注意，这里要恢复初始值，否则下次第一次不能上下滑动

                this.parentNode.style['overflowY'] = "auto";
                Vue.prototype.$eventBus.$emit('isLeftMoving', false)

            })
    }
}

Vue.directive('swipeLeft', {
    bind: function (el, binding) {
        if (binding.value.handle) {
            new swipeLeft(el, binding)
        } 
    }
})
