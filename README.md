1.customTree（自定义树）

一个自定义 jquery plugin

2.feature（特征）

树状结构显示数据，具有展开，折叠，同步加载，异步加载功能。仿造easyUI中的tree，但是功能没有那么齐全。

3.usage（使用）

1）tree用空的div元素来定义
<div id="tree1-div"></div>

2）javascript加载数据
<script type="text/javascript">
$("#tree1-div").createTree({
        width:"500px",
        height:"438px",
        isShowCheckbox:true,
        isShowRadio:false,
        isSingleSelect:true,//没有checkbox,没有radio的情况下,是单选还是复选
        url:"data/test7.json",
        method:"POST"
    });
</script>

4.tree data format（数据格式）

id：节点的id，对于加载远程数据很重要。
text：要显示的节点文本。
state：节点的状态，为open或closed，当设置为closed，表示该节点还有子节点，可以远程加载子节点。
children：子节点的节点数组。

5.attribute（属性）

url：获取远程数据的url。
method：请求url的方法。
width：指定宽度。
height：指定高度。
isShowCheckbox:是否显示checkbox。
isShowRadio:是否显示radio。
isSingleSelect:checkbox和radio都为false，是否是单选。

6.event（事件）

该插件的回调事件，参数“node”，包括：
id：节点的id
text：节点显示的文本
state：节点的状态

名称                         参数                          描述
onClick                      node                         当用户点击一个节点时触发。
onDblClick                   node                         当用户双击一个节点时触发。
onCheckboxSelect             node                         当用户选中checkbox时触发。
oncheckboxUnSelect           node                         当用户取消选中checkbox时触发。
onRadioSelect                node                         当用户选中radio时触发。
onRadioUnSelect              node                         当用户取消选中radio时触发。
onCollapse                   node                         当节点折叠时触发。
onExpand                     node                         当节点展开时触发。
onSelect                     node                         当选中节点。
onUnSelect                   node                         当取消选中节点。
onLoadSuccess                node，data                   当数据加载成功时触发。
onLoadError                  error                        当数据加载失败是触发。

7.methods（方法）

名称                          参数                          描述                      
getOptions                    none                         返回树的选项（options）。
getSelected                   none                         获取选中的节点并返回它，如果没有选中节点，则返回 null。
append                        param                        追加一些子节点到一个节点（可以是父节点或者子节点，子节点则会变为父节点，然后才加上要添加的节点），param 参数有两个属性：
                                                           parent：DOM 对象，要追加到的父节点。
                                                           data：数组，节点的数据。
remove                        target                       移除一个节点和它的子节点，target 参数表示节点的 DOM 对象。
toggleNode                    target                       切换节点的展开/折叠状态，target 参数表示节点的 DOM 对象。
collapseAll                   none                         折叠所有的节点。
expandAll                     none                         展开所有的节点。
loadData                      data                         加载树的数据。
reload                        none                         重新加载树的数据。
isLeafNode                    target                       判断指定的target节点是不是子节点（即叶节点）。
findNode                      id                           根据id找出该节点node。
collapseNode                  target                       折叠一个节点。
expandNode                    target                       展开一个节点。

