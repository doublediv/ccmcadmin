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
    },
    // 个位数加0
    add0(num) {
        return num < 10 ? '0' + num : num;
    },
    // 时间戳转日期
    formatDate(time) {
        let iTime = new Date(time)
        let year = iTime.getFullYear();
        let month = iTime.getMonth() + 1;
        let date = iTime.getDate();
        let hour = iTime.getHours();
        let minute = iTime.getMinutes();
        let second = iTime.getSeconds();

        return year + '-' + this.add0(month) + '-' + this.add0(date) + ' ' + this.add0(hour) + ':' + this.add0(minute) + ':' + this.add0(second);
    },
    
    // 打印
    print(id) {
        let printHtml = document.getElementById(id).innerHTML;
        let iframe = document.createElement("IFRAME");
        let doc = null;
        // iframe.setAttribute(
        //     "style",
        //     "position: absolute; width: 0px; height:0px; left: -500px; top: -500px;"
        // );
        document.body.appendChild(iframe);
        doc = iframe.contentWindow.document;
        doc.write("<div class='print-box'>"+ printHtml +"</div>");
        doc.close();
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
        document.body.removeChild(iframe);
    }

    



}