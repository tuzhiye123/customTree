(function($){

    var isDblClick;//判断是否双击
    var testIndex = 1;

    //请求数据
    function getData(options,target){

        $.ajax({
            type: options.method,
            url: options.url,
            dataType:"json",
            //dataType:"jsonp",
            //jsonp:"jsonpCallback",
            //jsonpCallback:"jsonResult",
            success: function (data) {
                //alert("数据请求成功");
                buildContent(options,data,target);
            },
            error:function(error){
                alert("数据请求错误");
            }
        });
    }

    //创建内容
    function buildContent(options,data,target){

        if(data != undefined && data != null && data != ""){

            if(data.length != 0){
                var width = options.width;
                var height = options.height;
                var isFirst = true;
                //count用来设置padding-left的长度,其中的count是指画ul的次数,首次设置为0
                var count = 0;
                var ul = getNode(data,isFirst,options,target,'',count);
                var content = '<div class="custom-tree-div" style="width: '+width+';height: '+height+';font-size: 12px;overflow: auto;">' + ul + '</div>';

                target.append(content);
                bindEvent(options,data,target);
            }
        }
    }

    //获取各个节点的html
    function getNode(nodeArray,isFirst,options,target,nodeId,count){

        var elementId = target.attr("id");

        //设置向下箭头或者向右箭头的paddingLeft的初始值为10px
        var paddingLeft = 13;
        //当前的paddingLeft,根据循环画ul的次数来计算paddingLeft,其中减去0是为了让数字字符串变为数字
        var currentPLeft = (5 + (paddingLeft - 0)*(count - 0)) +'px';

        //成员名字的paddingLeft偏移
        var userTextPLeft = 13;
        var currentTextUserPLeft = (5 + (userTextPLeft - 0)*(count - 0)) +'px';

        //每循环一次就加1
        count++;

        var ulHtml = '';
        if(isFirst == true){
            ulHtml ='<ul id="'+elementId+'-first-ul'+'" class="cmcc_left_menu-1">'
        }else{
            ulHtml = '<ul style="display: none;" id="'+elementId+'-ul-'+nodeId+'">';
        }
        isFirst = false;

        for(var i = 0;i < nodeArray.length;i++){

            var liHtml = "";
            var node = nodeArray[i];
            var text = node.text;
            var children = node.children;
            var state = node.state;
            var id = node.id;
            //自定义属性
            var selectAttr = false;

            //将node字符串化,然后把该字符串设置给自定义属性nodeAttr
            var nodeString = JSON.stringify(node);

            if(children != undefined && children != null && children != ""&& children.length != 0){
                //children要是有元素的话,需要再次进行ul绘制
                var ul = getNode(children,isFirst,options,target,id,count);
                if(options.isShowCheckbox == true && options.isShowRadio == false){
                    liHtml = '<li nodeAttr='+nodeString +' selectAttr='+selectAttr+ ' class="li-nowrap"><div class="li-div1"><img class="tree-arrow-img" style="margin-left: '+currentPLeft+'" src="img/icons/icon_arrow_right1.png"><a href="#" class="pdl5 user-li-inline-top a-hover">'+text+'<div class="cmcc_checkbox1 user-li-inline-top user-li-ml"><label class="cmcc_check_model1 checkbox_parent"><input type="checkbox" value="1"  /></label></div></a></div>';

                }else{
                    liHtml = '<li nodeAttr='+nodeString +' selectAttr='+selectAttr+' class="li-nowrap"><div class="li-div1"><img class="tree-arrow-img" style="margin-left: '+currentPLeft+'" src="img/icons/icon_arrow_right1.png"><a href="#" class="pdl5 user-li-inline-top a-hover">'+text+'</a></div>';
                }
                liHtml = liHtml + ul + '</li>';
                ulHtml += liHtml;
            }else if(state == "closed"){
                if(options.isShowCheckbox == true && options.isShowRadio == false){
                    liHtml = '<li nodeAttr='+nodeString +' selectAttr='+selectAttr+' class="li-nowrap"><div class="li-div1"><img class="tree-arrow-img" style="margin-left: '+currentPLeft+'" src="img/icons/icon_arrow_right1.png"><a href="#" class="pdl5 user-li-inline-top a-hover">'+text+'<div class="cmcc_checkbox1 user-li-inline-top user-li-ml"><label class="cmcc_check_model1 checkbox_parent"><input type="checkbox" value="1"  /></label></div></a></div>';
                }else{
                    liHtml = '<li nodeAttr='+nodeString +' selectAttr='+selectAttr+' class="li-nowrap"><div class="li-div1"><img class="tree-arrow-img" style="margin-left: '+currentPLeft+'" src="img/icons/icon_arrow_right1.png"><a href="#" class="pdl5 user-li-inline-top a-hover">'+text+'</a></div>';
                }
                liHtml = liHtml + '</li>';
                ulHtml += liHtml;
            }
            else{

                if(options.isShowCheckbox == true && options.isShowRadio == false){
                    liHtml = '<li nodeAttr='+nodeString +' selectAttr='+selectAttr+' class="li-nowrap"><div class="li-div2"><a href="#"  class="user-li-inline-top a-hover" style="margin-left: '+currentTextUserPLeft+'">'+text+'<div class="cmcc_checkbox1 user-li-inline-top user-li-ml"><label class="cmcc_check_model1 checkbox_child"><input type="checkbox" value="1"  /></label></div></a></div></li>';
                }else if(options.isShowCheckbox == false && options.isShowRadio == true){
                    liHtml = '<li nodeAttr='+nodeString +' selectAttr='+selectAttr+' class="li-nowrap"><div class="li-div2"><a href="#"  class="user-li-inline-top a-hover" style="margin-left: '+currentTextUserPLeft+'">'+text+'<div class="cmcc_radio_box1 user-li-inline-top user-li-ml"><label class="cmcc_radio_model1"><input type="radio" value="1"  /></label></div></a></div></li>';
                }else{//这个是预留动作,将后可能设置没有checkbox,没有radio的情况
                    liHtml = '<li nodeAttr='+nodeString +' selectAttr='+selectAttr+' class="li-nowrap"><div class="li-div2"><a href="#"  class="user-li-inline-top a-hover" style="margin-left: '+currentTextUserPLeft+'">'+text+'</a></div></li>';
                }
                ulHtml += liHtml;
            }
        }
        ulHtml += '</ul>';
        return ulHtml;
    }

    //将child li转换为parent li
    function changeChildToParent(li,options){

        var text = li.text();
        var liHtml = '';

        var ul = li.parent('ul');
        if(ul && ul.attr("class") != "cmcc_left_menu-1"){
            var paretLi = ul.parent('li');
            if(paretLi){
                var currentPLeft;
                var pl = paretLi.children().children("img").css("margin-left");

                currentPLeft = (pl.replace("px","")-0 + 13) +'px';
                if(options.isShowCheckbox == true && options.isShowRadio == false){
                    liHtml = '<div class="li-div1"><img class="tree-arrow-img" style="margin-left: '+currentPLeft+'" src="img/icons/icon_arrow_right1.png"><a href="#" class="pdl5 user-li-inline-top a-hover">'+text+'<div class="cmcc_checkbox1 user-li-inline-top user-li-ml"><label class="cmcc_check_model1 checkbox_parent"><input type="checkbox" value="1"  /></label></div></a></div>';
                }else{
                    liHtml = '<div class="li-div1"><img class="tree-arrow-img" style="margin-left: '+currentPLeft+'" src="img/icons/icon_arrow_right1.png"><a href="#" class="pdl5 user-li-inline-top a-hover">'+text+'</a></div>';
                }

            }
        }else if(ul && ul.attr("class") == "cmcc_left_menu-1"){
            if(options.isShowCheckbox == true && options.isShowRadio == false){
                liHtml = '<div class="li-div1"><img class="tree-arrow-img" style="margin-left: 5px;" src="img/icons/icon_arrow_right1.png"><a href="#" class="pdl5 user-li-inline-top a-hover">'+text+'<div class="cmcc_checkbox1 user-li-inline-top user-li-ml"><label class="cmcc_check_model1 checkbox_parent"><input type="checkbox" value="1"  /></label></div></a></div>';
            }else{
                liHtml = '<div class="li-div1"><img class="tree-arrow-img" style="margin-left: 5px;" src="img/icons/icon_arrow_right1.png"><a href="#" class="pdl5 user-li-inline-top a-hover">'+text+'</a></div>';

            }
        }
        $(li).unbind();//解绑事件
        //$(li).removeClass("user-li").html(liHtml);
        $(li).html(liHtml);
        return li;
    }

    //将parent li转换为child li
    function changeParentToChild(li,options){

        var text = li.text();
        var liHtml = '';
        var ul = li.parent('ul');
        var pl = li.children().children("img").css("margin-left");

        if(options.isShowCheckbox == false && options.isShowRadio == false && options.isSingleSelect == true){
            liHtml = '<div class="li-div2"><a href="#"  class="user-li-inline-top a-hover" style="margin-left: '+pl+'">'+text+'</a></div>';
        }else if(options.isShowCheckbox == false && options.isShowRadio == true){
            liHtml = '<div class="li-div2"><a href="#"  class="user-li-inline-top a-hover" style="margin-left: '+pl+'">'+text+'<div class="cmcc_radio_box1 user-li-inline-top user-li-ml"><label class="cmcc_radio_model1"><input type="radio" value="1"  /></label></div></a></div>';
        }else if(options.isShowCheckbox == true && options.isShowRadio == false){
            liHtml = '<div class="li-div2"><a href="#"  class="user-li-inline-top a-hover" style="margin-left: '+pl+'">'+text+'<div class="cmcc_checkbox1 user-li-inline-top user-li-ml"><label class="cmcc_check_model1 checkbox_child"><input type="checkbox" value="1"  /></label></div></a></div>';
        }

        $(li).unbind();//解绑事件
        //$(li).addClass("user-li").html(liHtml);
        $(li).html(liHtml);
        return li;
    }

    //绑定事件
    function bindEvent(options,data,target){

        var elementId = target.attr("id");
        var elementIdString = '#'+elementId;

        /********************复选框点击事件*********************/
            //父节点的checkbox
        $(elementIdString+' .checkbox_parent input[type="checkbox"]').off("click").on("click",function(event){
            stopPropagation(event);
            $(this).parent().hasClass("cmcc_check_on1")? $(this).parent().removeClass("cmcc_check_on1"):$(this).parent().addClass("cmcc_check_on1");

            //找到点击的全选的checkbox对应的li
            var el_li=$(this).parent().parent().parent().parent().parent();

            //判断该li下面是否还有ul,也就是是否还有展开子元素
            if(el_li.children("div").find("input").size()>0 && el_li.children("ul").size()>0){
                //找到input
                var input=el_li.children("div").find("input");
                //设置选中状态
                var checkstatus=false;
                //通过上面的input找到对应的lable,从而找到checkbox的class,判断该li是选中还是未选中
                if(input.parent().hasClass("cmcc_check_on1")){
                    checkstatus = true;
                }else{
                    checkstatus = false;
                }
                //点击父节点的checkbox,判断该父节点下面的包含有ul的父节点和子节点的选中或取消选中
                showSelectOrUnselect(el_li,checkstatus,options,target);
            }
        });

        //这里触发的是lable,也就是checkbox的边边,stopPropagation可以防止点击边边的时候触发父节点li-div1
        $(elementIdString+' .checkbox_parent').off("click").on("click",function(e){
            stopPropagation(e);
        });

        $(elementIdString+' .cmcc_check_model1').unbind("mouseenter").unbind("mouseleave");
        $(elementIdString +' .cmcc_check_model1').bind({
            mouseenter: function(e) {
                $(this).addClass("cmcc_check_hover1");
            },
            mouseleave: function(e) {
                $(this).removeClass("cmcc_check_hover1");
            }
        });

        //绑定鼠标覆盖事件
        $(elementIdString+' .li-div1').unbind("mouseenter").unbind("mouseleave");
        $(elementIdString +' .li-div1').bind({
            mouseenter: function(e) {
                $(this).addClass("li-div1-hover");
            },
            mouseleave: function(e) {
                $(this).removeClass("li-div1-hover");
            }
        });

        $(elementIdString+' .li-div2').unbind("mouseenter").unbind("mouseleave");
        $(elementIdString +' .li-div2').bind({
            mouseenter: function(e) {
                $(this).addClass("li-div2-hover");
            },
            mouseleave: function(e) {
                $(this).removeClass("li-div2-hover");
            }
        });

        /********************子节点复选框点击事件*********************/
        $(elementIdString + ' .checkbox_child input[type="checkbox"]').off("click").on("click",function(event){
            stopPropagation(event);
            var el_li = $(this).parent().parent().parent().parent().parent();

            //获取点击的li对应的node
            var node = JSON.parse(el_li.attr("nodeAttr"));
            //添加target
            node["target"] = el_li;

            var selectAttr = JSON.parse(el_li.attr("selectAttr"));
            var input=el_li.find("input");
            if(selectAttr == false){

                //找出li-div1的父类li
                $(elementIdString + ' .li-div1').parent().each(function(){
                    $(this).attr("selectAttr","false");
                    $(this).children().children("a").css("color","#7f7f7f");
                });

                el_li.attr("selectAttr","true");
                input.prop("checked", true);
                input.parent().addClass("cmcc_check_on1");
                el_li.find("a").css("color","#2e8fe5");
                //checkbox选中回调事件
                options.onCheckboxSelect(node);
                //子节点选中
                options.onSelect(node);

                var ul = el_li.parent();
                var children_lis=ul.children("li");//获取ul中的里标签,children_lis.size()查看里面有多少li
                var checkedCount = 1;
                //查看被点击的li中的同类li中有多少个是被选中的
                el_li.siblings("li").each(function(){
                    var input = $(this).find("input");
                    if(input.parent().hasClass("cmcc_check_on1")){
                        checkedCount ++;
                    }
                });
                var parentInput = el_li.parent().siblings("div").find("input");
                if(checkedCount == children_lis.size()){
                    parentInput.parent().addClass("cmcc_check_on1");
                }

            }else{

                el_li.attr("selectAttr","false");
                input.prop("checked", false);
                input.parent().removeClass("cmcc_check_on1");
                el_li.find("a").css("color","#7f7f7f");
                //checkbox取消选中回调事件
                options.oncheckboxUnSelect(node);
                //子节点取消选中
                options.onUnSelect(node);


                //取消父节点的选中(cmcc_check_on1和checked)
                findParentLiUnSelect(el_li);
            }
        });

        //子节点checkbox的lable
        $(elementIdString+' .checkbox_child').off("click").on("click",function(e){
            stopPropagation(e);
        });

        /********************单选框点击事件*********************/
        $(elementIdString+' .cmcc_radio_model1 input[type="radio"]').off("click").on("click",function(event){
            stopPropagation(event);
            //点击radio的时候也需要添加到右侧

            var el_li = $(this).parent().parent().parent().parent().parent();

            //获取点击的li对应的node
            var node = JSON.parse(el_li.attr("nodeAttr"));
            //添加target
            node["target"] = el_li;

            var selectAttr = JSON.parse(el_li.attr("selectAttr"));
            if(selectAttr == false){

                //找出li-div2的父类li
                $(elementIdString + ' .li-div2').parent().each(function(){
                    $(this).attr("selectAttr","false");
                    $(this).children().children("a").css("color","#7f7f7f");
                });

                //找出li-div1的父类li
                $(elementIdString + ' .li-div1').parent().each(function(){
                    $(this).attr("selectAttr","false");
                    $(this).children().children("a").css("color","#7f7f7f");
                });

                //移除所有radio选中,改变成员字体颜色
                removeAllRadioOnClassAndChangeColor(target);

                //选中自己
                var input=el_li.find("input");
                input.prop("checked", true);
                input.parent().addClass("cmcc_radio_on1");
                el_li.find("a").css("color","#2e8fe5");
                el_li.attr("selectAttr","true");

                //radio选中回调
                options.onRadioSelect(node);
                //子节点选中
                options.onSelect(node);

            }else{

                //选中自己
                var input=el_li.find("input");
                input.prop("checked", false);
                input.parent().removeClass("cmcc_radio_on1");
                el_li.attr("selectAttr","false");
                el_li.find("a").css("color","#7f7f7f");

                //radio取消选中回调
                options.onRadioUnSelect(node);
                //子节点取消选中
                options.onUnSelect(node);
            }
        });

        //点击radio的边边的时候cmcc_radio_model1会响应,会触发input和子节点li-div2,所以需要在cmcc_radio_model1中取消它父节点li-div2的响应事件
        $(elementIdString+' .cmcc_radio_model1').off("click").on("click",function(e){
            stopPropagation(e);
        });

        $(elementIdString+' .cmcc_radio_model1').unbind("mouseenter").unbind("mouseleave");
        $(elementIdString +' .cmcc_radio_model1').bind({
            mouseenter: function(e) {
                $(this).addClass("cmcc_radio_hover1");
            },
            mouseleave: function(e) {
                $(this).removeClass("cmcc_radio_hover1");
            }
        });

        /*********************父li折叠和展开事件***********************/
            //父节点的展开和折叠调用方法
        $(elementIdString+' .cmcc_left_menu-1 li .li-div1').unbind("click").click(function(){

            //获取该li
            var li = $(this).parent("li");
            var node = JSON.parse(li.attr("nodeAttr"));
            //添加target
            node["target"] = li;

            var state = node.state;
            var currentClosedId = node.id;

            var liTarget = $(this).parent("li");
            var liDiv1 = $(this);
            //获取margin-left
            var iPLeft = $(this).children("img").css("margin-left");
            var iPLeftNum = iPLeft.replace("px","");
            //获取count,也就是有多少层循环
            var count = (iPLeftNum-5)/13;
            //在获取的基础上加1,传给getNode,再进行请求数据后的绘制
            count += 1;

            var selectAttr = JSON.parse(li.attr("selectAttr"));
            if((options.isShowCheckbox == false && options.isShowRadio == false && options.isSingleSelect == true) || (options.isShowCheckbox == false && options.isShowRadio == true)){

                if(selectAttr == false){//为false,则改变为选中状态

                    //找出li-div1的父类li
                    $(elementIdString + ' .li-div1').parent().each(function(){
                        $(this).attr("selectAttr","false");
                        $(this).children().children("a").css("color","#7f7f7f");
                    });

                    //改变选中li
                    li.attr("selectAttr","true");
                    li.children().children("a").css("color","#2e8fe5");

                    //子节点选中
                    options.onSelect(node);

                }else{//为true,则改变为非选中状态

                    li.attr("selectAttr","false");
                    li.children().children("a").css("color","#7f7f7f");

                    //子节点取消选中
                    options.onUnSelect(node);
                }

            }else if((options.isShowCheckbox == false && options.isShowRadio == false && options.isSingleSelect == false) || (options.isShowCheckbox == true && options.isShowRadio == false)){

                if(selectAttr == false){

                    //找出li-div1的父类li
                    $(elementIdString + ' .li-div1').parent().each(function(){
                        $(this).attr("selectAttr","false");
                        $(this).children().children("a").css("color","#7f7f7f");
                    });

                    li.attr("selectAttr","true");
                    li.children().children("a").css("color","#2e8fe5");

                    //子节点选中
                    options.onSelect(node);

                }else{

                    li.attr("selectAttr","false");
                    li.children().children("a").css("color","#7f7f7f");
                    //子节点取消选中
                    options.onUnSelect(node);
                }
            }

            if(state == "closed"){//当state为closed状态

                //获取ul
                var childUl = liDiv1.siblings("ul");

                if(!childUl.html()){//html里面要是没有元素,则不存在子成员,需要进行绘制
                    $.ajax({
                        type: options.method,
                        url:"data/test4.json",
                        dataType:"json",
                        //url: options.url,
                        //dataType:"jsonp",
                        //jsonp:"jsonpCallback",
                        //jsonpCallback:"jsonResult",
                        data:{
                            id:currentClosedId
                        },
                        success: function (data) {

                            //获取请求请求回来数据对应的ul,currentClosedId是用来给接下来要绘制的ul绑定id的,绘制ulHtml
                            var ul = getNode(data,false,options,target,currentClosedId,count);
                            liTarget.append(ul);
                            //设置li的id
                            liTarget.attr("id",currentClosedId);
                            collapseOrExpand(liDiv1,options,node);
                            //绑定子子节点事件
                            bindNodeEvent(target,options,currentClosedId,data);
                        },
                        error:function(error){
                            alert("数据请求错误");
                            //请求数据失败回调
                            options.onLoadError(error);
                        }
                    });
                }else{
                    collapseOrExpand(liDiv1,options,node);
                }

            }else{//state为open或者state没有赋值
                collapseOrExpand(liDiv1,options,node);
            }
        });

        /****************成员li点击事件**************************/
            //li双击事件
        $(elementIdString+' .li-div2').parent().unbind("dblclick").on("dblclick",function(){
            var el_li=$(this);
            isDblClick = true;
            //获取点击的li对应的node
            var node = JSON.parse(el_li.attr("nodeAttr"));
            //添加target
            node["target"] = el_li;

            //双击回调,checkbox和radio是一样的callback
            options.onDblClick(node);
        });

        //li单击事件
        $(elementIdString+' .li-div2').parent().unbind("click").click(function(){

            var el_li=$(this);
            isDblClick = false;
            setTimeout(function(){

                if(isDblClick != false)return;
                //获取点击的li对应的node
                var node = JSON.parse(el_li.attr("nodeAttr"));
                //添加target
                node["target"] = el_li;

                var selectAttr = JSON.parse(el_li.attr("selectAttr"));
                if(options.isShowCheckbox == true && options.isShowRadio == false){//checkbox

                    //找出这个li中的input
                    var input=el_li.find("input");
                    //swapStatus(el_li,options,target);
                    if(selectAttr == true){//成员没有选中

                        input.prop("checked", false);
                        input.parent().removeClass("cmcc_check_on1");
                        el_li.attr("selectAttr","false");
                        el_li.find("a").css("color","#7f7f7f");

                        //checkbox取消选中回调事件
                        options.oncheckboxUnSelect(node);
                        //取消选中子节点
                        options.onUnSelect(node);
                        //取消父节点的选中(cmcc_check_on1和checked)
                        findParentLiUnSelect(el_li);

                    }else{//成员选中

                        //找出li-div1的父类li
                        $(elementIdString + ' .li-div1').parent().each(function(){
                            $(this).attr("selectAttr","false");
                            $(this).children().children("a").css("color","#7f7f7f");
                        });
                        el_li.attr("selectAttr","true");
                        input.prop("checked", true);
                        input.parent().addClass("cmcc_check_on1");
                        el_li.find("a").css("color","#2e8fe5");

                        //checkbox选中回调事件
                        options.onCheckboxSelect(node);
                        //选中子节点
                        options.onSelect(node);

                        var ul = el_li.parent();
                        var children_lis=ul.children("li");//获取ul中的里标签,children_lis.size()查看里面有多少li
                        var checkedCount = 1;
                        //查看被点击的li中的同类li中有多少个是被选中的
                        el_li.siblings("li").each(function(){
                            var input = $(this).find("input");
                            if(input.parent().hasClass("cmcc_check_on1")){
                                checkedCount ++;
                            }
                        });
                        var parentInput = el_li.parent().siblings("div").find("input");
                        if(checkedCount == children_lis.size()){
                            parentInput.parent().addClass("cmcc_check_on1");
                            parentInput.prop("checked", true);
                        }
                    }

                }else if(options.isShowCheckbox == false && options.isShowRadio == true){//radio

                    if(selectAttr == false){

                        //找出li-div2的父类li
                        $(elementIdString + ' .li-div2').parent().each(function(){
                            $(this).attr("selectAttr","false");
                            $(this).children().children("a").css("color","#7f7f7f");
                        });

                        //找出li-div1的父类li
                        $(elementIdString + ' .li-div1').parent().each(function(){
                            $(this).attr("selectAttr","false");
                            $(this).css("color","#7f7f7f");
                        });

                        //移除所有radio选中,改变成员字体颜色
                        removeAllRadioOnClassAndChangeColor(target);

                        //选中自己
                        var input=el_li.find("input");
                        input.prop("checked", true);
                        input.parent().addClass("cmcc_radio_on1");
                        el_li.find("a").css("color","#2e8fe5");
                        el_li.attr("selectAttr","true");

                        //radio选中回调
                        options.onRadioSelect(node);
                        //选中子节点
                        options.onSelect(node);

                    }else{

                        //选中自己
                        var input=el_li.find("input");
                        input.prop("checked", false);
                        input.parent().removeClass("cmcc_radio_on1");
                        el_li.attr("selectAttr","false");
                        el_li.find("a").css("color","#7f7f7f");

                        //radio取消选中回调
                        options.onRadioUnSelect(node);
                        //取消选中子节点
                        options.onUnSelect(node);
                    }

                }else{

                    var a = el_li.find("a");

                    if(options.isSingleSelect == true){//单选

                        if(selectAttr == false){//选中

                            //找出li-div2的父类li
                            $(elementIdString + ' .li-div2').parent().each(function(){
                                $(this).attr("selectAttr","false");
                                $(this).children().children("a").css("color","#7f7f7f");
                            });

                            //找出li-div1的父类li
                            $(elementIdString + ' .li-div1').parent().each(function(){
                                $(this).attr("selectAttr","false");
                                $(this).children().children("a").css("color","#7f7f7f");
                            });

                            //改变选中的li
                            el_li.attr("selectAttr","true");
                            a.css("color","#2e8fe5");
                            options.onSelect(node);

                        }else{//没选中
                            el_li.attr("selectAttr","false");
                            a.css("color","#7f7f7f");
                            options.onUnSelect(node);
                        }

                    }else{//多选

                        if(selectAttr == false){

                            //找出li-div1的父类li
                            $(elementIdString + ' .li-div1').parent().each(function(){
                                $(this).attr("selectAttr","false");
                                $(this).children().children("a").css("color","#7f7f7f");
                            });

                            el_li.attr("selectAttr","true");
                            a.css("color","#2e8fe5");
                            options.onSelect(node);

                        }else{
                            el_li.attr("selectAttr","false");
                            a.css("color","#7f7f7f");
                            options.onUnSelect(node);
                        }
                    }
                }

                //点击回调,注意回调需要在,点击li-div2完成所有事件之后再回调
                options.onClick(node);

            },200);
        });
    }

    /***********************li父节点的绑定事件,也就是点击异步加载树的绑定事件*************************/
    //父节点li里面的ul的相关点击事件
    function bindNodeEvent(target,options,nodeId,data){

        var elementId = target.attr("id");
        var elementIdString = '#'+ elementId;
        var ulIdString = elementIdString + '-ul-'+ nodeId;//ul的id

        /********************复选框点击事件*********************/
            //父节点的checkbox
        $(elementIdString + ' ' + ulIdString + ' .checkbox_parent input[type="checkbox"]').off("click").on("click",function(event){
            stopPropagation(event);
            $(this).parent().hasClass("cmcc_check_on1")? $(this).parent().removeClass("cmcc_check_on1"):$(this).parent().addClass("cmcc_check_on1");

            //找到点击的全选的checkbox对应的li
            var el_li=$(this).parent().parent().parent().parent().parent();
            //判断该li下面是否还有ul,也就是是否还有展开子元素
            if(el_li.children("div").find("input").size()>0 && el_li.children("ul").size()>0){
                //找到input
                var input=el_li.children("div").find("input");
                //设置选中状态
                var checkstatus=false;
                //通过上面的input找到对应的lable,从而找到checkbox的class,判断该li是选中还是未选中
                if(input.parent().hasClass("cmcc_check_on1")){
                    checkstatus = true;
                }else{
                    checkstatus = false;
                }
                showSelectOrUnselect(el_li,checkstatus,options,target);
            }
        });

        $(elementIdString + ' ' + ulIdString + ' .checkbox_parent').off("click").on("click",function(e){
            stopPropagation(e);
        });

        $(elementIdString + ' '+ ulIdString + ' .cmcc_check_model1').unbind("mouseenter").unbind("mouseleave");
        $(elementIdString + ' '+ ulIdString + ' .cmcc_check_model1').bind({
            mouseenter: function(e) {
                $(this).addClass("cmcc_check_hover1");
            },
            mouseleave: function(e) {
                $(this).removeClass("cmcc_check_hover1");
            }
        });

        /********************子节点 复选框点击事件*********************/
        $(elementIdString + ' ' + ulIdString + ' .checkbox_child input[type="checkbox"]').off("click").on("click",function(event){
            stopPropagation(event);
            var el_li = $(this).parent().parent().parent().parent().parent();

            //获取点击的li对应的node
            var node = JSON.parse(el_li.attr("nodeAttr"));
            //添加target
            node["target"] = el_li;

            var selectAttr = JSON.parse(el_li.attr("selectAttr"));
            var input=el_li.find("input");
            if(selectAttr == false){

                //找出li-div1的父类li
                $(elementIdString + ' .li-div1').parent().each(function(){
                    $(this).attr("selectAttr","false");
                    $(this).children().children("a").css("color","#7f7f7f");
                });

                el_li.attr("selectAttr","true");
                input.prop("checked", true);
                input.parent().addClass("cmcc_check_on1");
                el_li.find("a").css("color","#2e8fe5");
                //checkbox选中回调事件
                options.onCheckboxSelect(node);
                //选中子节点
                options.onSelect(node);

                var ul = el_li.parent();
                var children_lis=ul.children("li");//获取ul中的里标签,children_lis.size()查看里面有多少li
                var checkedCount = 1;
                //查看被点击的li中的同类li中有多少个是被选中的
                el_li.siblings("li").each(function(){
                    var input = $(this).find("input");
                    if(input.parent().hasClass("cmcc_check_on1")){
                        checkedCount ++;
                    }
                });
                var parentInput = el_li.parent().siblings("div").find("input");
                if(checkedCount == children_lis.size()){
                    parentInput.parent().addClass("cmcc_check_on1");
                }

            }else{

                el_li.attr("selectAttr","false");
                input.prop("checked", false);
                input.parent().removeClass("cmcc_check_on1");
                el_li.find("a").css("color","#7f7f7f");
                //checkbox选中回调事件
                options.oncheckboxUnSelect(node);
                //取消选中子节点
                options.onUnSelect(node);

                //取消父节点的选中(cmcc_check_on1和checked)
                findParentLiUnSelect(el_li);
            }
        });

        $(elementIdString + ' ' + ulIdString + ' .checkbox_child').off("click").on("click",function(e){
            stopPropagation(e);
        });

        /********************单选框点击事件*********************/
        $(elementIdString + ' ' + ulIdString + ' .cmcc_radio_model1 input[type="radio"]').off("click").on("click",function(event){
            stopPropagation(event);
            //点击radio的时候也需要添加到右侧
            var el_li = $(this).parent().parent().parent().parent().parent();

            //获取点击的li对应的node
            var node = JSON.parse(el_li.attr("nodeAttr"));
            //添加target
            node["target"] = el_li;

            var selectAttr = JSON.parse(el_li.attr("selectAttr"));
            if(selectAttr == false){

                //找出li-div2的父类li
                $(elementIdString + ' .li-div2').parent().each(function(){
                    $(this).attr("selectAttr","false");
                    $(this).children().children("a").css("color","#7f7f7f");
                });

                //找出li-div1的父类li
                $(elementIdString + ' .li-div1').parent().each(function(){
                    $(this).attr("selectAttr","false");
                    $(this).children().children("a").css("color","#7f7f7f");
                });

                //移除所有radio选中,改变成员字体颜色
                removeAllRadioOnClassAndChangeColor(target);

                //选中自己
                var input=el_li.find("input");
                input.prop("checked", true);
                input.parent().addClass("cmcc_radio_on1");
                el_li.find("a").css("color","#2e8fe5");
                el_li.attr("selectAttr","true");

                //radio选中回调
                options.onRadioSelect(node);
                //选中子节点
                options.onSelect(node);

            }else{

                //选中自己
                var input=el_li.find("input");
                input.prop("checked", false);
                input.parent().removeClass("cmcc_radio_on1");
                el_li.attr("selectAttr","false");
                el_li.find("a").css("color","#7f7f7f");

                //radio取消选中回调
                options.onRadioUnSelect(node);
                //取消选中子节点
                options.onUnSelect(node);
            }
        });

        $(elementIdString+ ' ' + ulIdString + ' .cmcc_radio_model1').off("click").on("click",function(e){
            stopPropagation(e);
        });

        $(elementIdString + ' ' + ulIdString +' .cmcc_radio_model1').unbind("mouseenter").unbind("mouseleave");
        $(elementIdString + ' ' + ulIdString +' .cmcc_radio_model1').bind({
            mouseenter: function(e) {
                $(this).addClass("cmcc_radio_hover1")
            },
            mouseleave: function(e) {
                $(this).removeClass("cmcc_radio_hover1");
            }
        });

        //绑定鼠标覆盖事件
        $(elementIdString + ' '+ ulIdString +' .li-div1').unbind("mouseenter").unbind("mouseleave");
        $(elementIdString +' .li-div1').bind({
            mouseenter: function(e) {
                $(this).addClass("li-div1-hover");
            },
            mouseleave: function(e) {
                $(this).removeClass("li-div1-hover");
            }
        });

        $(elementIdString + ' '+ ulIdString +' .li-div2').unbind("mouseenter").unbind("mouseleave");
        $(elementIdString +' .li-div2').bind({
            mouseenter: function(e) {
                $(this).addClass("li-div2-hover");
            },
            mouseleave: function(e) {
                $(this).removeClass("li-div2-hover");
            }
        });

        /****************成员li点击事件**************************/
            //成员li单击事件,这里的nodeId是父节点li的id
        $(elementIdString + ' ' + ulIdString + ' .li-div2').parent().unbind("click").on("click",function(){

            var el_li=$(this);
            isDblClick = false;

            setTimeout(function(){

                if(isDblClick != false)return;
                //获取点击的li对应的node
                var node = JSON.parse(el_li.attr('nodeAttr'));
                //添加target
                node["target"] = el_li;

                var selectAttr = JSON.parse(el_li.attr("selectAttr"));
                if(options.isShowCheckbox == true && options.isShowRadio == false){//checkbox

                    //找出这个li中的input
                    var input=el_li.find("input");
                    //swapStatus(el_li,options,target);
                    if(selectAttr == true){//成员没有选中

                        input.prop("checked", false);
                        input.parent().removeClass("cmcc_check_on1");
                        el_li.attr("selectAttr","false");
                        el_li.find("a").css("color","#7f7f7f");

                        //checkbox取消选中回调事件
                        options.oncheckboxUnSelect(node);
                        //取消选中子节点
                        options.onUnSelect(node);

                        //取消父节点的选中(cmcc_check_on1和checked)
                        findParentLiUnSelect(el_li);

                    }else{//成员选中

                        //找出li-div1的父类li
                        $(elementIdString + ' .li-div1').parent().each(function(){
                            $(this).attr("selectAttr","false");
                            $(this).children().children("a").css("color","#7f7f7f");
                        });
                        el_li.attr("selectAttr","true");
                        input.prop("checked", true);
                        input.parent().addClass("cmcc_check_on1");
                        el_li.find("a").css("color","#2e8fe5");

                        //checkbox选中回调事件
                        options.onCheckboxSelect(node);
                        //选中子节点
                        options.onSelect(node);

                        var ul = el_li.parent();
                        var children_lis=ul.children("li");//获取ul中的里标签,children_lis.size()查看里面有多少li
                        var checkedCount = 1;
                        //查看被点击的li中的同类li中有多少个是被选中的
                        el_li.siblings("li").each(function(){
                            var input = $(this).find("input");
                            if(input.parent().hasClass("cmcc_check_on1")){
                                checkedCount ++;
                            }
                        });
                        var parentInput = el_li.parent().siblings("div").find("input");
                        if(checkedCount == children_lis.size()){
                            parentInput.parent().addClass("cmcc_check_on1");
                        }
                    }

                }else if(options.isShowCheckbox == false && options.isShowRadio == true){//radio

                    if(selectAttr == false){

                        //找出li-div2的父类li
                        $(elementIdString + ' .li-div2').parent().each(function(){
                            $(this).attr("selectAttr","false");
                            $(this).children().children("a").css("color","#7f7f7f");
                        });

                        //找出li-div1的父类li
                        $(elementIdString + ' .li-div1').parent().each(function(){
                            $(this).attr("selectAttr","false");
                            $(this).children().children("a").css("color","#7f7f7f");
                        });

                        //移除所有radio选中,改变成员字体颜色
                        removeAllRadioOnClassAndChangeColor(target);

                        //选中自己
                        var input=el_li.find("input");
                        input.prop("checked", true);
                        input.parent().addClass("cmcc_radio_on1");
                        el_li.find("a").css("color","#2e8fe5");

                        el_li.attr("selectAttr","true");

                        //radio选中回调
                        options.onRadioSelect(node);
                        //选中子节点
                        options.onSelect(node);

                    }else{

                        //选中自己
                        var input=el_li.find("input");
                        input.prop("checked", false);
                        input.parent().removeClass("cmcc_radio_on1");
                        el_li.attr("selectAttr","false");
                        el_li.find("a").css("color","#7f7f7f");

                        //radio取消选中回调
                        options.onRadioUnSelect(node);
                        //取消选中子节点
                        options.onUnSelect(node);
                    }

                }else{

                    var a = el_li.find("a");

                    if(options.isSingleSelect == true){//没有checkbox和radio的单选

                        if(selectAttr == false){

                            //找出li-div1的父类li
                            $(elementIdString +' .li-div1').parent().each(function(){
                                $(this).attr("selectAttr","false");
                                $(this).children().children("a").css("color","#7f7f7f");
                            });

                            //找出li-div2的父类li
                            $(elementIdString +' .li-div2').parent().each(function(){
                                $(this).attr("selectAttr","false");
                                $(this).children().children("a").css("color","#7f7f7f");
                            });

                            //改变选中的li
                            el_li.attr("selectAttr","true");
                            a.css("color","#2e8fe5");
                            options.onSelect(node);

                        }else{
                            el_li.attr("selectAttr","false");
                            a.css("color","#7f7f7f");
                            options.onUnSelect(node);
                        }

                    }else{//多选

                        if(selectAttr == false){

                            //找出li-div1的父类li
                            $(elementIdString + ' .li-div1').parent().each(function(){
                                $(this).attr("selectAttr","false");
                                $(this).children().children("a").css("color","#7f7f7f");
                            });

                            el_li.attr("selectAttr","true");
                            a.css("color","#2e8fe5");
                            options.onSelect(node);

                        }else{
                            el_li.attr("selectAttr","false");
                            a.css("color","#7f7f7f");
                            options.onUnSelect(node);
                        }
                    }
                }
                //点击回调,在最后再回调
                options.onClick(node);

            },200);
        });

        //li双击事件
        $(elementIdString + ' ' + ulIdString + ' .li-div2').parent().unbind("dblclick").on("dblclick",function(){

            var el_li=$(this);
            isDblClick = true;
            //获取点击的li对应的node
            var node = JSON.parse(el_li.attr('nodeAttr'));
            //添加target
            node["target"] = el_li;

            //双击回调,checkbox和radio是一样的callback
            options.onDblClick(node);
        });

        //父节点的展开和折叠调用方法
        $(elementIdString+' .cmcc_left_menu-1'+' '+ulIdString+' li .li-div1').unbind("click").click(function(){

            //获取该li
            var li = $(this).parent("li");

            var liTarget = $(this).parent("li");
            var liDiv1 = $(this);
            //获取margin-left
            var iPLeft = $(this).children("img").css("margin-left");
            var iPLeftNum = iPLeft.replace("px","");
            //获取count,也就是有多少层循环
            var count = (iPLeftNum-5)/13;
            //在获取的基础上加1,传给getNode,再进行情趣句数据后的绘制
            count += 1;
            //获取点击的li对应的node
            var node = JSON.parse(li.attr('nodeAttr'));
            //添加target
            node["target"] = li;

            var state = node.state;
            var currentClosedId = node.id;

            var selectAttr = JSON.parse(li.attr("selectAttr"));
            if((options.isShowCheckbox == false && options.isShowRadio == false && options.isSingleSelect == true) || (options.isShowCheckbox == false && options.isShowRadio == true)){

                if(selectAttr == false){

                    //找出li-div1的父类li
                    $(elementIdString +' .li-div1').parent().each(function(){
                        $(this).attr("selectAttr","false");
                        $(this).children().children("a").css("color","#7f7f7f");
                    });

                    li.attr("selectAttr","true");
                    li.children().children("a").css("color","#2e8fe5");

                    //选中子节点
                    options.onSelect(node);

                }else{

                    li.attr("selectAttr","false");
                    li.children().children("a").css("color","#7f7f7f");

                    //取消选中子节点
                    options.onUnSelect(node);
                }

            }else{

                if(selectAttr == false){

                    //找出li-div1的父类li
                    $(elementIdString + ' .li-div1').parent().each(function(){
                        $(this).attr("selectAttr","false");
                        $(this).children().children("a").css("color","#7f7f7f");
                    });

                    li.attr("selectAttr","true");
                    li.children().children("a").css("color","#2e8fe5");

                    //选中子节点
                    options.onSelect(node);

                }else{

                    li.attr("selectAttr","false");
                    li.children().children("a").css("color","#7f7f7f");

                    //取消选中子节点
                    options.onUnSelect(node);
                }
            }

            //判断是否是closed节点,是的话要进行判断是否是已加载的父节点,如果已加载就不需要进行数据请求,需要需要进行判断折叠还是展开
            if(state == "closed"){//当state为closed状态
                //获取ul
                var childUl = liDiv1.siblings("ul");

                if(!childUl.html()){//html里面要是没有元素,则不存在子成员,需要进行绘制

                    testIndex ++;
                    var testString = 'data/test'+testIndex+'.json';

                    $.ajax({
                        type: options.method,
                        url:testString,
                        dataType:"json",
                        //url: options.url,
                        //dataType:"jsonp",
                        //jsonp:"jsonpCallback",
                        //jsonpCallback:"jsonResult",
                        data:{
                            id:currentClosedId
                        },
                        success: function (data) {

                            //获取请求请求回来数据对应的ul
                            var ul = getNode(data,false,options,target,currentClosedId,count);
                            liTarget.append(ul);
                            liTarget.attr("id",currentClosedId);
                            //加载成功回调
                            options.onLoadSuccess(node,data);
                            //判断折叠还是展开
                            collapseOrExpand(liDiv1,options,node);
                            //绑定node事件
                            bindNodeEvent(target,options,currentClosedId,data);
                        },
                        error:function(error){
                            alert("数据请求错误");
                            //请求数据失败回调
                            options.onLoadError(error);
                        }
                    });
                }else{
                    collapseOrExpand(liDiv1,options,node);
                }
            }else{//state为open或者state没有赋值
                collapseOrExpand(liDiv1,options,node);
            }
        });
    }

    //判断点击后是要折叠还是展开
    function collapseOrExpand(elementTarget,options,node){

        //判断折叠还是展开
        if(elementTarget.siblings("ul").is(":hidden")){//显示  slideDown:让隐藏的ul以滑动的形式展开
            elementTarget.siblings("ul").slideDown();
            elementTarget.children("img").attr("src", "img/icons/icon_arrow_down1.png");
            //展开回调
            options.onExpand(node);

        }else{//隐藏   slideUp:让显示的ul以滑动的形式隐藏起来
            elementTarget.siblings("ul").slideUp();
            elementTarget.children("img").attr("src", "img/icons/icon_arrow_right1.png");
            //折叠回调
            options.onCollapse(node);
        }
    }

    /*
     * el_li:是全选对应li
     * checkstatus:全选对应的状态
     * 点击父节点的checkbox,判断该父节点下面的包含有ul的父节点和子节点的选中或取消选中
     * */
    function showSelectOrUnselect(el_li,checkstatus,options,target){

        var ul=el_li.children("ul");//获取ul标签
        var children_lis=ul.children("li");//获取ul中的里标签

        for (var i=0;i<children_lis.size() ;i++ ){
            //获取子li
            var sub_el_li=$(children_lis.get(i));
            var input=sub_el_li.find("input");
            //判断是否还有ul
            if(!input.parent().hasClass("checkbox_parent")){//不是父节点,也就是没有checkbox_parent
                //swapStatus(sub_el_li,options,target);
                var input=sub_el_li.find("input");
                if(checkstatus == true){
                    input.prop("checked", true);
                    input.parent().addClass("cmcc_check_on1");
                    sub_el_li.find("a").css("color","#2e8fe5");

                    sub_el_li.attr("selectAttr","true");
                }else{
                    input.prop("checked", false);
                    input.parent().removeClass("cmcc_check_on1");
                    sub_el_li.find("a").css("color","#7f7f7f");

                    sub_el_li.attr("selectAttr","false");
                }

            }else{//是父节点,则有ul,则再进行一次检查,并且改变父节点的"checked"和"cmcc_check_on1"
                showSelectOrUnselect(sub_el_li,checkstatus,options,target);
                //修改含有ul的li中的checkbox的选中或不选中,注意这里是点击全选节点,所以需要改变ul中的又含有ul的li的checkbox
                //这里的checkstatus是通过上面的全选的监听事件传递下来的
                if(checkstatus == true){
                    var sub_input=sub_el_li.find("input");
                    sub_input.prop("checked", true);
                    sub_input.parent().addClass("cmcc_check_on1");

                }else{
                    var sub_input=sub_el_li.find("input");
                    sub_input.prop("checked", false);
                    sub_input.parent().removeClass("cmcc_check_on1");
                }
            }
        }
    }

    //移除所有radio选中,改变成员字体颜色
    function removeAllRadioOnClassAndChangeColor(target){
        var elementId = target.attr("id");
        var elementIdString = '#'+elementId;
        //删除所有li标签的中的选中
        $(elementIdString +" .custom-tree-div li").find("input").prop("checked", false);//选中的相邻节点设置不选中
        $(elementIdString +" .custom-tree-div li").find("label").removeClass("cmcc_radio_on1");
        //改版li中的a的颜色
        $(elementIdString +" .custom-tree-div li").find("a").css("color","#7f7f7f");
    }

    //找到父节点,取消选中父节点的checkbox
    function findParentLiUnSelect(li){

        var ul = li.parent();
        var div = ul.siblings("div");
        var divClass = div.attr("class");

        //查看是否存在li-div1,相当于查看是否有父元素的checkbox(也就是全选的checkbox)
        if(divClass == "li-div1"){

            //当选择取消成员时,需要判断全选checkbox是否有选中,有选中的话,需要将全选取消
            var myInput = li.parent().siblings("div").find("input");
            if(myInput.parent().hasClass("cmcc_check_on1")){
                myInput.parent().removeClass("cmcc_check_on1");
                myInput.prop("checked", false);
            }
        }
    }

    ////根据li中的checkbox中的状态或者是指定状态status进行添加或者删除,这里有改变cmcc_check_on
    //function swapStatus(el_li,options,target){
    //    //选中自己
    //    var input=el_li.find("input");
    //
    //    if(!input.is(":checked")||!input.parent().hasClass("cmcc_check_on1")){ //如果自己是非选中状态
    //
    //        input.prop("checked", true);
    //        input.parent().addClass("cmcc_check_on1");
    //        el_li.find("a").css("color","#2e8fe5");
    //
    //    }else{ //如果自己是选中状态
    //
    //        input.prop("checked", false);
    //        input.parent().removeClass("cmcc_check_on1");
    //        el_li.find("a").css("color","#7f7f7f");
    //    }
    //}

    //点击子元素不会触发父元素
    function stopPropagation(e){
        if(e && e.stopPropagation){//非IE浏览器
            e.stopPropagation();
        }else{//IE浏览器
            window.event.cancelBubble = true;
        }
    }

    //收集插件所有方法,通过传递该方法的字符串名称给插件以调用它们
    var methods = {
        //初始化
        init: function (options) {

            return this.each(function () {
                $(window).bind('resize.createTree');
                var target = $(this);
                var elementId = target.attr("id");

                //获取options
                options = $.extend({}, $.fn.createTree.defaults, options);

                //存储options
                $(this).data(elementId,options);
                //数据请求,创建树
                getData(options,target);
            });
        },

        //销毁插件
        destroy: function () {
            return this.each(function () {
                $(window).unbind('.createTree');
            })
        },

        //往某个节点拼接节点
        append:function(opts){
            //获取最外层target
            var target = $(this);
            var elementId = target.attr("id");
            //获取存储的options
            var options = $(this).data(elementId);
            //要拼接tree的节点
            var parent = opts.parent;
            //拼接的数据
            var data = opts.data;

            var li = parent;

            if(li != "" && li != undefined && li != null){

                var node = JSON.parse(li.attr("nodeAttr"));
                var state = node.state;
                var currentClosedId = node.id;
                var selectAttr = JSON.parse(li.attr("selectAttr"));
                //获取div,以获取class,用来判断是父节点还是子节点
                var subDiv = li.children('div');

                if(subDiv.attr("class") == "li-div1"){//父节点

                    if(selectAttr == true){//选中

                        //获取margin-left
                        var iPLeft = li.children().children("img").css("margin-left");
                        //去掉px
                        var iPLeftNum = iPLeft.replace("px","");
                        //获取count,也就是有多少层循环
                        var count = (iPLeftNum-5)/13;
                        //在获取的基础上加1,传给getNode,再进行情趣句数据后的绘制
                        count += 1;

                        //获取请求请求回来数据对应的ul
                        var ul = getNode(data,false,options,target,currentClosedId,count);

                        if(!li.children("ul").html()){//判断是否已经有ul,没有有ul的话,证明是没有下级节点,则需要最外层的ul
                            li.append(ul);
                        }else{//判断是否已经有ul,有ul的话,证明是在同一级添加,则不需要最外层的ul
                            li.children("ul").append($(ul).html());
                        }

                        li.attr("id",currentClosedId);
                        //绑定node事件
                        bindNodeEvent(target,options,currentClosedId,data);
                    }

                }else if(subDiv.attr("class") == "li-div2"){//子节点

                    if(selectAttr == true){//选中

                        //获取margin-left
                        var iPLeft = li.children().children("a").css("margin-left");

                        var iPLeftNum = iPLeft.replace("px","");
                        //获取count,也就是有多少层循环
                        var count = (iPLeftNum-5)/13;
                        //在获取的基础上加1,传给getNode,再进行情趣句数据后的绘制
                        count += 1;

                        var ul = li.parent('ul');
                        if(ul.html()){
                            var ulId = ul.attr('id');
                            var ulIdString = '#'+ulId;

                            var liHtml =  changeChildToParent(li,options);

                            bindEvent(options,data,target);
                            bindNodeEvent(target,options,currentClosedId,data);

                            //获取请求请求回来数据对应的ul
                            var ul1 = getNode(data,false,options,target,currentClosedId,count);
                            liHtml.append(ul1);
                            liHtml.attr("id",currentClosedId);
                            //子节点变为父节点需要获取新的div,后面用于折叠与展开的判断
                            var subDiv1 = $(liHtml).children('div');
                            //加载成功回调
                            options.onLoadSuccess(node,data);
                            //判断折叠还是展开
                            collapseOrExpand(subDiv1,options,node);
                            //绑定node事件
                            bindNodeEvent(target,options,currentClosedId,data);
                        }
                    }
                }
            }
        },

        //移除节点
        remove:function(elmtTarget){

            //这个是最外层,套用tree的元素的对象
            var target = $(this);
            var elementId = target.attr("id");
            //获取options
            var options = $(this).data(elementId);
            //要移除的target
            var removeTarget = elmtTarget;

            var li = removeTarget;

            if(li != "" && li != undefined && li != null){

                var node = JSON.parse(li.attr("nodeAttr"));
                var state = node.state;
                var currentClosedId = node.id;

                //获取selectAttr,判断是否选中
                var selectAttr = JSON.parse(li.attr("selectAttr"));
                //获取div,以获取class,用来判断是父节点还是子节点
                var subDiv = li.children('div');

                if(subDiv.attr("class") == "li-div1") {//父节点

                    if(selectAttr == true){
                        var ul = li.parent('ul');
                        li.remove();
                        if(ul.has("li").length == 0){//li全部删除

                            var parentLi = ul.parent('li');
                            if(parentLi.html()){//判断parentLi是否存在
                                var liHtml = changeParentToChild(parentLi,options);

                                bindEvent(options,"",target);
                                bindNodeEvent(target,options,currentClosedId,"");
                            }
                        }
                    }

                }else if(subDiv.attr("class") == "li-div2") {//子节点

                    if(selectAttr == true){
                        var ul = li.parent('ul');
                        li.remove();
                        if(ul.has("li").length == 0){//li全部删除,找到删除后的父节点,将父节点转换为子节点

                            var parentLi = ul.parent('li');
                            if(parentLi.html()){//判断parentLi是否存在

                                var liHtml = changeParentToChild(parentLi,options);

                                bindEvent(options,"",target);
                                bindNodeEvent(target,options,currentClosedId,"");
                            }
                        }
                    }
                }
            }
        },

        //节点的展开折叠切换
        toggleNode:function(elmtTarget){

            var target = $(this);
            var elementId = target.attr("id");
            var options = $(this).data(elementId);

            var toggleTarget = elmtTarget;
            var node = JSON.parse(toggleTarget.attr("nodeAttr"));
            //添加target
            node["target"] = toggleTarget;

            if(toggleTarget){//判断是否有target

                var elementTarget = toggleTarget.children("div");
                //判断折叠还是展开
                if(elementTarget.siblings("ul").is(":hidden")){//显示  slideDown:让隐藏的ul以滑动的形式展开
                    //elementTarget.siblings("ul").slideDown().find("li ul").hide();
                    elementTarget.siblings("ul").slideDown();
                    //elementTarget.children("i").addClass("fa-angle-down");
                    elementTarget.children("img").attr("src", "img/icons/icon_arrow_down1.png");
                    //展开回调
                    options.onExpand(node);

                }else{//隐藏   slideUp:让显示的ul以滑动的形式隐藏起来
                    elementTarget.siblings("ul").slideUp();
                    //elementTarget.children("i").removeClass("fa-angle-down").addClass("fa-angle-right");
                    elementTarget.children("img").attr("src", "img/icons/icon_arrow_right1.png");
                    //折叠回调
                    options.onCollapse(node);
                }
            }
        },

        //关闭所有节点
        collapseAll:function(){

            var target = $(this);
            var elementId = target.attr("id");
            var elementIdString = '#'+elementId;

            $(elementIdString +' .li-div1').each(function(){

                $(this).siblings("ul").slideUp();
                //$(this).children("i").removeClass("fa-angle-down").addClass("fa-angle-right");
                $(this).children("img").attr("src", "img/icons/icon_arrow_right1.png");
            })
        },

        //展开所有节点
        expandAll:function(){

            var target = $(this);
            var elementId = target.attr("id");
            var elementIdString = '#'+elementId;

            $(elementIdString + ' .li-div1').each(function(){

                $(this).siblings("ul").slideDown();
                //$(this).children("i").addClass("fa-angle-down");
                $(this).children("img").attr("src", "img/icons/icon_arrow_down1.png");
            });
        },

        //加载树的数据
        loadData:function(data){

            var target = $(this);
            var elementId = target.attr("id");
            var options = $(this).data(elementId);

            //先将原来的树置空
            $(target).html("");
            if(data){
                buildContent(options,data,target)
            }
        },

        //重载树的数据
        reload:function(){

            var target = $(this);
            var elementId = target.attr("id");
            var options = $(this).data(elementId);

            //先将原来的树置空
            $(target).html("");
            getData(options,target);
        },

        //是否是子节点
        isLeafNode:function(elmtTarget){
            var nodeTarget = elmtTarget;
            if(nodeTarget){
                var subDiv = $(nodeTarget).children('div');
                if(subDiv.hasClass("li-div2")){
                    return true;
                }else{
                    return false;
                }
            }
        },

        //根据id查找node
        findNode:function(fNodeId){
            var target = $(this);
            var elementId = target.attr("id");
            var elementIdString = '#'+elementId;

            //获取要查找的节点id
            var findNodeId = fNodeId;

            if(findNodeId){
                var node;
                //用来存放选中的节点
                var nodes = [];
                //遍历所有li
                $(elementIdString + ' .cmcc_left_menu-1 li').each(function(){

                    var li = $(this);
                    node = JSON.parse($(this).attr("nodeAttr"));
                    var nodeId = node.id;

                    if(nodeId == findNodeId){
                        //添加target
                        node["target"] = li;
                        nodes.push(node);
                    }
                });

                if(nodes.length > 0){
                    return nodes[0];
                }else{
                    return null;
                }

            }else{
                alert("请输入要查找的id");
                return null;
            }
        },

        //获取options
        getOptions:function(){

            var target = $(this);
            var elementId = target.attr("id");
            var options = $(this).data(elementId);
            return options;
        },

        //折叠一个节点
        collapseNode:function(elmtTarget){

            var target = $(this);
            var elementId = target.attr("id");
            var options = $(this).data(elementId);

            var collapseTarget = elmtTarget;
            if(collapseTarget){

                var subDiv = collapseTarget.children('div');

                if(!subDiv.siblings('ul').is(":hidden")){//显示
                    subDiv.siblings("ul").slideUp();
                    //subDiv.children("i").removeClass("fa-angle-down").addClass("fa-angle-right");
                    subDiv.children("img").attr("src", "img/icons/icon_arrow_right1.png");

                    var node = JSON.parse(collapseTarget.attr("nodeAttr"));
                    node["target"] = collapseTarget;
                    //折叠回调
                    options.onCollapse(node);
                }
            }
        },

        //展开一个节点
        expandNode:function(elmtTarget){

            var target = $(this);
            var elementId = target.attr("id");
            var options = $(this).data(elementId);

            var expandTarget = elmtTarget;
            if(expandTarget){

                var subDiv = expandTarget.children('div');

                if(subDiv.siblings('ul').is(":hidden")){//隐藏

                    subDiv.siblings("ul").slideDown();
                    //subDiv.children("i").addClass("fa-angle-down");
                    subDiv.children("img").attr("src", "img/icons/icon_arrow_down1.png");

                    var node = JSON.parse(expandTarget.attr("nodeAttr"));
                    node["target"] = expandTarget;
                    //折叠回调
                    options.onCollapse(node);
                }
            }
        },

        //获取选中的
        getSelected:function(){

            var target = $(this);
            var elementId = target.attr("id");
            var elementIdString = '#'+elementId;

            //用数组来存储选中的li
            var nodes = [];
            $(elementIdString + ' li').each(function(){
                var selectAttr = JSON.parse($(this).attr("selectAttr"));

                if(selectAttr == true){//被选中
                    //获取node data
                    var node = JSON.parse($(this).attr("nodeAttr"));
                    //添加选中的li
                    node["target"] = $(this);
                    nodes.push(node);
                }
            });

            if(nodes.length > 0){
                return nodes;
            }else{
                return null;
            }
        }
    };


    //定义插件
    $.fn.createTree = function (method) {

        if (methods[method]) {//插件其它方法
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {//插件初始化
            return methods.init.apply(this, arguments);
        } else {//找不到插件对应的方法
            $.error('Method ' + method + ' does not exist on jQuery.createTree');
        }
    };




    //var Plugin = function (element, options) {
    //    this.element = element;
    //    this.options = options;
    //
    //    this.init(this.options);
    //};
    //Plugin.prototype = {
    //
    //    init: function (options) {
    //
    //        return this.element.each(function () {
    //            $(window).bind('resize.createTree');
    //            var target = $(this);
    //            var elementId = target.attr("id");
    //
    //            //获取options
    //            options = $.extend({}, $.fn.createTree.defaults, options);
    //
    //            //数据请求,创建树
    //            getData(options,target);
    //        });
    //    },
    //
    //    //获取options
    //    getOptions:function(){
    //        return this.options;
    //    },
    //
    //    //关闭所有节点
    //    collapseAll:function(){
    //
    //        var target = this.element;
    //        var elementId = target.attr("id");
    //        var elementIdString = '#'+elementId;
    //
    //        $(elementIdString +' .li-div1').each(function(){
    //
    //            $(this).siblings("ul").slideUp();
    //            $(this).children("i").removeClass("fa-angle-down").addClass("fa-angle-right");
    //        })
    //    }
    //
    //};
    //$.fn.createTree = function (options) {
    //    // 合并参数
    //    return this.each(function () {
    //
    //        // 在这里编写相应的代码进行处理
    //        var ui = $._data(this, "createTree");
    //        // 如果该元素没有初始化过(可能是新添加的元素), 就初始化它.
    //        if (!ui) {
    //            var opts = $.extend(true, {}, $.fn.createTree.defaults, typeof options === "object" ? options : {});
    //            ui = new Plugin($(this), opts);
    //            // 缓存插件
    //            $._data(this, "createTree", ui);
    //        }
    //        // 调用方法
    //        if (typeof options === "string" && typeof ui[options] == "function") {
    //            // 执行插件的方法
    //            //ui[options].apply(ui, arguments);
    //            ui[options].apply(this, Array.prototype.slice.call(arguments, 1));
    //        }
    //
    //        //var data = $.data(this, "createTree");
    //        //
    //        //if (data) {
    //        //    alert("test");
    //        //    (typeof options === 'string' && data[options]) ? data[options]() : data.init(options);
    //        //} else {
    //        //    alert("test1");
    //        //    $.data(this, "createTree", new Plugin($(this), options));
    //        //}
    //
    //    });
    //
    //};


    // 默认参数
    $.fn.createTree.defaults = {

        width:"600px",
        height:"438px",
        isShowCheckbox:true,
        isShowRadio:false,
        isSingleSelect:true,//没有checkbox,没有radio的情况下,是单选还是复选
        url:"data/test7.json",
        method:"POST"
    };

})(jQuery);
