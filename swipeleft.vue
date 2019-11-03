<style lang="less" scoped>
    .newaddWrapper{
        font-size:100px;   
    }
    .head{
            height: 2rem;
            background-color: #F5F5F5;
            // font-size: 0.32rem;
            color: #999999;
            overflow: hidden;
            .headUl{
                margin-left: 0.306667rem;
                list-style-type :none;
                font-size:0.8rem;
                line-height:2rem;
            }
        }
    .content{
        -webkit-overflow-scrolling: touch;
        overflow:hidden;
        
        .pull-refresh {
        width: 100%;
        color: #999;
        transition-duration: 200ms;
        font-size: .07rem;
        height: 32px;
        }
        .itemDiv{
            position:relative;
            .itemUl{
                list-style-type :none;
                margin-left: 0.306667rem;
                height: 3.533333rem;
                overflow: hidden;
                border-bottom: 0.013333rem solid #E9E9E9;
                -webkit-transform: translateX(0);
                transform: translateX(0);
                .list-1{
                    font-size: 0.7rem;
                    color: #333333;
                    margin: 0.493333rem 0 0.186667rem 0;
                    height: 0.426667rem;
                    line-height: 0.426667rem;
                    .listspan-1{
                        float: right;
                        text-align: right;
                        color: #999999;
                        margin-right: 1.2rem;
                        width: 5.066667rem;
                    }
                }
                .list-2{
                    font-size: 0.4rem;
                    color: #333333;
                    margin: 0.493333rem 0 0.186667rem 0;
                    height: 0.426667rem;
                    line-height: 0.426667rem;
                }
                .list-3{
                    font-size: 0.4rem;
                    color: #333333;
                    margin: 0.493333rem 0 0.186667rem 0;
                    height: 0.426667rem;
                    line-height: 0.426667rem;
                }
                .icon-more{
                    font-family: 'icomoon' !important;
                    speak: none;
                    font-style: normal;
                    font-weight: normal;
                    font-variant: normal;
                    text-transform: none;
                    line-height: 1;
                    -webkit-font-smoothing: antialiased;
                    font-size: 0.4rem;
                    position: absolute;
                    right: 0.586667rem;
                    top: 50%;
                    -webkit-transform: translateY(-50%);
                    transform: translateY(-50%);
                }
            }
            .btnArray{
                position: absolute;
                top: 0;
                right: -7rem;
                text-align: center;
                font-size:0.7rem;
                color: #fff;
                height: 3.533333rem;
                width: 7rem;
                display:flex;
                align-items:center;
                justify-content:center;
                .check{
                    width: 50%;
                    background: #f29901;
                    height:100%;
                    line-height: 3.3rem;
                }
                .delete{
                    width: 50%;
                    background: red;
                    height:100%;
                    line-height: 3.3rem;
                }
            }
        }
    }
    
</style>

<template>
    <div class="newaddWrapper">
        <div class="head">
            <ul class="headUl">
                <li>{{title}}</li>
            </ul>
        </div>
        <div class="content" @touchstart="touchStart($event)" 
            @touchmove="touchMove($event)" 
            @touchend="touchEnd($event)" 
            :style="{transform: 'translate3d(0,' + top + 'px, 0)'}">
            <div name="pull-refresh">
                <div class="down-tip" v-if="dropDownState==1">
                    <!-- <img v-if="dropDownInfo.downImg" class="down-img" :src="require('../../assets/images/refreshAndReload/'+dropDownInfo.downImg)"> -->
                    
                    <span class="down-text">{{dropDownInfo.downText}}</span>
                </div>
                <div class="up-tip" v-if="dropDownState==2">
                    <!-- <img v-if="dropDownInfo.upImg" class="up-img" :src="require('../../assets/images/refreshAndReload/'+dropDownInfo.upImg)"> -->
                    <span class="up-text">{{dropDownInfo.upText}}</span>
                </div>
                <div class="refresh-tip" v-if="dropDownState==3">
                    <!-- <img v-if="dropDownInfo.refreshImg" class="refresh-img" :src="require('../../assets/images/loading/'+dropDownInfo.refreshImg)"> -->
                    <span class="refresh-text">{{dropDownInfo.refreshText}}</span>
                </div>
            </div>
            <div class="itemDiv"  v-for="(item, index) in dataList" :key="index"   
             v-swipeLeft="{
                node: '.btnArray', 
                widthNode: '.btnArray', 
                handle: true,
                parentNode:'.newaddWrapper',
            }">

                <ul class="itemUl">
                    <li class="list-1">
                        <span class="listspan-1">订单{{ item }}</span>
                        <span class="listspan-2">1.00PCS</span>
                    </li>
                    <li class="list-2">0000000001</li>
                    <li class="list-3">111</li>
                    <li class="icon-more"></li>
                </ul>
                <div class="btnArray" >
                    <div class="check" @click.stop="checkConfirm(list,index,$event)">批改仓库</div>
                    <div class="delete" @click.stop="deletConform(list)">删除</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return {
            title:'订单行',
            dataList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            defaultOffset: 50, // 默认高度, 相应的修改.releshMoudle的margin-top和.down-tip, .up-tip, .refresh-tip的height
            top: 0,
            scrollIsToTop: 0,
            startY: 0,
            isDropDown: false, // 是否下拉
            isRefreshing: false, // 是否正在刷新
            dropDownState: 1, // 显示1:下拉可以刷新, 2:松开立即刷新, 3:正在刷新数据中...
            dropDownInfo: {
                downText: '下拉可以刷新',
                downImg: 'arrow.png',
                upText: '松开立即刷新',
                upImg: 'arrow.png',
                refreshText: '正在刷新数据...',
                refreshImg: 'loading.png'
            }
        }
    },
    methods: {
        touchStart (e) {
      this.startY = e.targetTouches[0].pageY
    },
    touchMove (e) {
      this.scrollIsToTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop // safari 获取scrollTop用window.pageYOffset
        if (e.targetTouches[0].pageY > this.startY) {
            console.log(this.scrollIsToTop, 'this.scrollIsToTop')
            // 下拉
            this.isDropDown = true
            if (this.scrollIsToTop === 0 && !this.isRefreshing) {
            // 拉动的距离
            let diff = e.targetTouches[0].pageY - this.startY - this.scrollIsToTop
            this.top = Math.pow(diff, 0.8) + (this.dropDownState === 3 ? this.defaultOffset : 0)
            console.log(this.top, this.dropDownState === 3, 'this.top')
            if (this.top >= this.defaultOffset) {
                this.dropDownState = 2
                console.log('松开立即刷新')
                e.preventDefault()
            } else {
                console.log('下拉可以刷新')
                this.dropDownState = 1
                // 去掉会导致ios无法刷新
                e.preventDefault()
            }
            }
        } else {
            this.isDropDown = false
            this.dropDownState = 1
        }
        },
        touchEnd () {
        if (this.isDropDown && !this.isRefreshing) {
            if (this.top >= this.defaultOffset) {
            // do refresh
            this.refresh()
            this.isRefreshing = true
            } else {
            // cancel refresh
            this.isRefreshing = false
            this.isDropDown = false
            this.dropDownState = 1
            this.top = 0
            }
        }
        },
        /**
         * 刷新
         */
        refresh () {
        this.dropDownState = 3
        this.top = this.defaultOffset
        console.log(this.top, 'refresh')
        // 这是全是静态数据,延时1200毫秒，给用户一个刷新的感觉，如果是接口数据的话，直接调接口即可
        setTimeout(() => {
            // this.onRefresh(this.refreshDone)
            this.onRefresh()
            this.refreshDone()
        }, 2000)
        },
        /**
         * 刷新完成
         */
        refreshDone () {
        this.isRefreshing = false
        this.isDropDown = false
        this.dropDownState = 1
        this.top = 0
        },
        /**
         * 刷新数据
         */
        onRefresh () {
        for(let i =0 ; i < 5; i++) {
            this.dataList.unshift(Math.ceil(Math.random()*100))
        }
        }
    }

}
</script>
