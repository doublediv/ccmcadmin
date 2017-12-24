import { embed_reader, READER_TYPE, FUNCIDS } from "./interface.js"
import { } from "./base.js"
var icdev = -1;
var isComOpen = false;
// 创建设备
var obj = embed_reader.getOBJ(READER_TYPE._reader_type_contactLess);
obj.onResult(function (rData) {
    // 链接设备
    if (rData.FunctionID == FUNCIDS._fid_initialcom) {
        var opst;
        var rel = rData.RePara_Int;
        if (0 == rel) {
            var hdev = parseInt(rData.RePara_Str);
            if (hdev != -1) {
                icdev = hdev;
                obj.beep(icdev, 10);   //do a beep
                // console.log('Link reader ok');
                isComOpen = true;             //Set reader link status
            } else {
                // console.log('Link reader error');
                alert("链接失败，请检查设备！")
                isComOpen = false;           //Set reader link failed status
            }
        } else {
            // console.log('Link reader error');
            alert("链接失败，请检查设备！")
        }

    }
    //找卡
    if (rData.FunctionID == FUNCIDS._fid_findCardStr) {
        var strcard = rData.RePara_Str;
        if (strcard != "") {
            // console.log(strcard);
            localStorage.setItem("vipnumber", JSON.stringify(strcard))
        } else {
            // console.log('Found no card');
            alert("读卡失败，请链接设备，放好卡片！")
        }
    }
});
export default {

    // 链接设备
    linkDevice() {
        try {
            if (isComOpen == false)          //if reader link failed
            {
                //alert("initialcom");
                obj.initialcom(100, 115200);
            }
        } catch (e) { alert(e.message); }
        return;
    },

    // 找卡
    toFindTheCard() {
        obj.findcardStr(icdev, 0);//1);     //1: multy card mode
    }



}