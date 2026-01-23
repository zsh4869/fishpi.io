// ==UserScript==
// @name         鱼派小尾巴
// @namespace    http://tampermonkey.net/
// @version      1.6.6
// @description  try to thank APTX-4869!
// @author       (江户川-哀酱)APTX-4869
// @match        https://fishpi.cn/cr
// @icon         https://fishpi.cn/images/favicon.png
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @connect      elves.x-meta.online
// @grant        unsafeWindow
// ==/UserScript==

(function () {
    'use strict';
    const version_us = "v1.6.6";
    var vipList = Label.vipUserList;
    var heads = document.getElementsByTagName("head");
    var link = document.getElementsByTagName("link");
    var suffixFlag = window.localStorage['xwb_flag'] ? JSON.parse(window.localStorage['xwb_flag']) : false;
    var zspdFlag = window.localStorage['zspd_flag'] ? JSON.parse(window.localStorage['zspd_flag']) : false;
    if (!zspdFlag) {
        Label.vipUserList = vipList;
    } else {
        Label.vipUserList = [];
    }
    console.log('众生平等：' + zspdFlag);
    var tongji_flag = window.localStorage['fish_game_flag'] ? parseInt(window.localStorage['fish_game_flag']) : -1;
    var oldMsgTime = window.localStorage['oldMsgTime'] ? window.localStorage['oldMsgTime'] : 0;
    var autoParseFlag = true;
    var borderFlag = window.localStorage['borderFlag'];
    var lspCDKEY = window.localStorage['lspCDKEY'];
    var focusStorage = window.localStorage['focus_users'] ? window.localStorage['focus_users'] : "";
    var focus_users = focusStorage.split(",");
    // 渔场token
    var yc_token = window.localStorage['yc_token'] ? window.localStorage['yc_token'] : '';
    Label.vipUsers = [];
    // console.log(lspCDKEY);
    GM_registerMenuCommand("小尾巴开关", () => {
        suffixFlag = !suffixFlag;
        window.localStorage['xwb_flag'] = suffixFlag;
        xwb_btn.textContent = suffixFlag? '小尾巴：on' : '小尾巴：off';
    });
    GM_registerMenuCommand("众生平等", () => {
        zspdFlag = !zspdFlag;
        window.localStorage['zspd_flag'] = zspdFlag;
        zspd_btn.textContent = zspdFlag ? '众生平等：on' : '众生平等：off';
        if (!zspdFlag) {
            Label.vipUserList = vipList;
        } else {
            Label.vipUserList = [];
        }
    });
    GM_registerMenuCommand("精灵消息监听", () => {
        tongji_flag = tongji_flag * -1;
        window.localStorage['fish_game_flag'] = tongji_flag;
        console.log("精灵消息监听" + (tongji_flag > 0 ? "开启" : "关闭"));
        window.location.reload();
    });
    GM_registerMenuCommand("聊天框边框", () => {
        window.localStorage['borderFlag'] = Number.isNaN(parseInt(window.localStorage['borderFlag'])) ? 1 : parseInt(window.localStorage['borderFlag']) * -1;
        window.location.reload();
    });
    GM_registerMenuCommand("修改cdkey", () => {
        var cdkey = prompt("请输入cdkey（只要不清空缓存就无需重复修改）", window.localStorage['lspCDKEY']);
        if (cdkey === null) {
            return;
        }
        window.localStorage['lspCDKEY'] = cdkey;
        window.location.reload();
    });
    GM_registerMenuCommand("特别关注提醒", () => {
        var focusParam = prompt("请输入你想要收到消息提醒的吊毛用户id，多个用户之间用英文的逗号隔开", window.localStorage['focus_users'] ? window.localStorage['focus_users'] : "");
        if (focusParam.trim().length > 0) {
            focus_users = focusParam.split(",");
            window.localStorage['focus_users'] = focusParam;
        } else {
            focus_users = [];
            window.localStorage['focus_users'] = focusParam;
        }
    });
    if (borderFlag > 0) {
        var color = prompt("请输入三个16进制的色值，用英文逗号隔开", "#8f41e9,#578aef,#ff5277");
        if (color === null) {
            return;
        }
        var css = [
            ".chats__content{",
            "border-radius: 10px;",
            "border: 5px solid;",
            "border-image: linear-gradient(" + color + ")30 30;",
            "background-position: -100px 1px, calc(100% - 1px) -100px, calc(100% + 100px) calc(100% - 1px), 1px 0px;",
            "animation: moveLine 8s infinite linear;",
            "};",
            "@keyframes moveLine { 0% { background-position: -100px 1px, calc(100% - 1px) -100px, calc(100% + 100px) calc(100% - 1px), 1px 0px; } 30% { background-position: 100% 1px, calc(100% - 1px) -100px, calc(100% + 100px) calc(100% - 1px), 1px -100px; } 50% { background-position: calc(100% + 100px) 1px, calc(100% - 1px) 100%, calc(100% + 100px) calc(100% - 1px), -100px -100px; } 80% { background-position: calc(100% + 100px) 1px, calc(100% - 1px) calc(100% + 100px), 0px calc(100% - 1px), 1px calc(100% + 100px); } 100% { background-position: calc(100% + 100px) 1px, calc(100% - 1px) calc(100% + 100px), -100px calc(100% - 1px), 1px 0px; } }",
        ].join("\n");
        var node = document.createElement("style");
        node.type = "text/css";
        node.appendChild(document.createTextNode(css));
        heads[0].appendChild(node);
    }

    function getHYD() {
        var hyd;
        $.ajax({
            url: "https://fishpi.cn/user/liveness?_timestemp",
            type: "GET",
            async: false,
            success: function (e) {
                hyd = e.liveness;
            }
        });
        return hyd;
    }

    ChatRoom.setVipUserName = function(e, t) {
        if (zspdFlag) {
            return '    <span class="ft-gray">' + (null != t ? t + "-" : "") + e.userNickname + "</span>&nbsp;\n"
        } else {
            const a = this.vipUserList.find((t => t.userId == e.userOId));
            if (a && "" != a.configJson) {
                const s = []
                , {bold: n, underline: o, color: i} = a.configJson
                , {lvCode: l} = a;
                let r = ""
                , c = "";
                return n && s.push("font-weight: bold;"),
                o && s.push("text-decoration: underline;"),
                i && i.startsWith("#") ? s.push(`color: ${i};`) : c = i,
                r = s.join(""),
                '<span class="ft-gray ' + c + '" style="' + r + '">' + (null != t ? t + "-" : "") + e.userNickname + "</span>&nbsp;\n"
            }
            return '    <span class="ft-gray">' + (null != t ? t + "-" : "") + e.userNickname + "</span>&nbsp;\n"
        }
    }

    for (let i = 0; i < link.length; i++) {
        if (link[i].rel == 'icon') {
            link[i].href = 'https://www.baidu.com/img/baidu_85beaf5496f291521eb75ba38eacbd87.svg';
        }
    }
    // Your code here...
    ChatRoom.send = function (needwb) {
        // var hyd = getHYD();
        var wbMsg = '\n\n\n> ——嘀嘀🎉 [如何使用小尾巴](https://fishpi.cn/article/1658802906181) ';
        if (!ChatRoom.isSend) {
            ChatRoom.isSend = !0;
            var e = ChatRoom.editor.getValue();
            if (ChatRoom.quoteData.userName && ChatRoom.quoteData.content) {
                let t = ChatRoom.quoteData.content.replace(/\n/g, "\n> ");
                e = `\n##### 引用 @${ChatRoom.quoteData.userName} [↩](${Label.servePath}/cr#chatroom${ChatRoom.quoteData.messageId} "跳转至原消息")  \n> ${t}</span>\n\n` + e
            }
            var t = {
                content: e,
                client: thisClient
            };
            ChatRoom.editor.setValue(""),
            $.ajax({
                url: Label.servePath + "/chat-room/send",
                type: "POST",
                cache: !1,
                data: JSON.stringify({
                    content: e.trim().length == 0 || (!suffixFlag) || needwb == 0 || e.trim().startsWith('凌 ') || e.trim().startsWith('鸽 ') || e.trim().startsWith('冰冰 ') || e.trim().startsWith('点歌 ') || e.trim().startsWith('TTS ')|| e.trim().startsWith('zf') || e.trim().startsWith('朗读 ') ? e : e + wbMsg,
                    client: "PC/小尾巴1.6.6 01-23更新"
                }),
                beforeSend: function() {
                    $(".form button.red").attr("disabled", "disabled").css("opacity", "0.3")
                },
                success: function(t) {
                    0 === t.code ? ($("#chatContentTip").removeClass("error succ").html(""),
                    ChatRoom.cancelQuote()) : ($("#chatContentTip").addClass("error").html("<ul><li>" + t.msg + "</li></ul>"),
                    ChatRoom.editor.setValue(ChatRoom.editor.getValue().replace(e.split("\n\n")[0] + "\n\n", "")))
                },
                error: function(t) {
                    $("#chatContentTip").addClass("error").html("<ul><li>" + t.statusText + "</li></ul>"),
                    ChatRoom.editor.setValue(ChatRoom.editor.getValue().replace(e.split("\n\n")[0] + "\n\n", ""))
                },
                complete: function(e, t) {
                    ChatRoom.isSend = !1,
                    $(".form button.red").removeAttr("disabled").css("opacity", "1")
                }
            })
        }
    };


    // 获取列表
    var x = document.getElementsByClassName('reply')[0];
    // 创建 div 图层
    var elve = document.createElement("div");


     // 获取列表
    var x = document.getElementsByClassName('reply')[0];
    // 创建 div 图层
    var elve = document.createElement("div");

    // 信息
    var info = document.createElement("button");
    info.id = "info";
    info.textContent = "冰冰背包";
    info.className = "red";
    info.setAttribute('style', 'margin-right:5px');
    //绑定按键点击功能
    info.onclick = function () {
        sendMsgApi("冰冰 背包");
        return;
    };


    // 打劫
    var jl_hlsg = document.createElement("button");
    jl_hlsg.id = "hlsg";
    jl_hlsg.textContent = "查询积分";
    jl_hlsg.className = "red";
    jl_hlsg.setAttribute('style', 'margin-right:5px');
    //绑定按键点击功能
    jl_hlsg.onclick = function () {
        sendMsgApi("小斗士 查询积分");
    };


    // 盲盒
    var ice_mh = document.createElement("button");
    ice_mh.id = "mh";
    ice_mh.textContent = "小冰盲盒";
    ice_mh.className = "red";
    ice_mh.setAttribute('style', 'margin-right:5px');
    //绑定按键点击功能
    ice_mh.onclick = function () {
        // sendMsgApi("鸽 行行好吧");
        sendMsgApi("冰冰 开盲盒");
    };


    // 小尾巴开关
    var xwb_btn = document.createElement("button");
    xwb_btn.id = "yyc";
    xwb_btn.textContent = suffixFlag? '小尾巴：on' : '小尾巴：off';
    xwb_btn.className = "red";
    xwb_btn.setAttribute('style', 'margin-right:5px');
    //绑定按键点击功能
    xwb_btn.onclick = function () {
        suffixFlag = !suffixFlag;
        console.log('小尾巴：' + suffixFlag);
        xwb_btn.textContent = suffixFlag ? '小尾巴：on' : '小尾巴：off';
        window.localStorage['xwb_flag'] = suffixFlag;
    };

    // zspd_btn
    var zspd_btn = document.createElement("button");
    zspd_btn.id = "zspd";
    zspd_btn.textContent = zspdFlag? '众生平等：on' : '众生平等：off';
    zspd_btn.className = "red";
    zspd_btn.setAttribute('style', 'margin-right:5px');
    //绑定按键点击功能
    zspd_btn.onclick = function () {
        zspdFlag = !zspdFlag;
        console.log('众生平等：' + zspdFlag);
        zspd_btn.textContent = zspdFlag ? '众生平等：on' : '众生平等：off';
        window.localStorage['zspd_flag'] = zspdFlag;
        if (!zspdFlag) {
            Label.vipUserList = vipList;
        } else {
            Label.vipUserList = [];
        }
    };


    // 清除通知和私信
    var clearMsg = document.createElement("button");
    clearMsg.id = "clearMsg";
    clearMsg.textContent = "清空通知";
    clearMsg.className="red";
    clearMsg.setAttribute('style','margin-right:5px');
    //绑定按键点击功能
    clearMsg.onclick = function (){
        $.ajax({
            url: Label.servePath + "/chat/mark-all-as-read?apiKey=" + Label.node.apiKey,
            type: "GET",
            async: false,
            success: function (e) {

            }
        });
        $.ajax({
            url:Label.servePath + "/notifications/all-read",
            type: "GET",
            async: false,
            success: function (e) {

            }
        });
        return
    };


    elve.appendChild(ice_mh);
    elve.appendChild(jl_hlsg);
    elve.appendChild(info);
    elve.appendChild(xwb_btn);
    elve.appendChild(zspd_btn);
    elve.appendChild(clearMsg);
    elve.id = "elves";
    elve.align = "right";
    x.appendChild(elve);

    function sendMsgApi(msg){
        var redPacketData = {
            "content": msg,
            "client": "Web/小尾巴快捷端" + version_us
        };
        $.ajax({
            url: "https://fishpi.cn/chat-room/send",
            type: "POST",
            async: false,
            data: JSON.stringify(redPacketData),
            success: function (e) {

            }
        });
    }

    function sendJLMsg(msg, user) {
        if (yc_token.length == 0) {
            renderNoteMsg('脚本未获取到您的渔场token，已自动发送获取渔场token的命令！请收到token私信后重试……');
            sendMsgApi("凌 渔场初始化");
            return;
        }
        // /fishery/inst/push
        var url = "https://elves.x-meta.online/fishery/inst/push?token=" + yc_token + "&inst=" + msg;
        if (user && user.length > 0) {
            url = url + "&opts=" + user
        }
        // console.log('url', url);
        $.ajax({
            url: url,
            type: "GET",
            async: false,
            success: function (e) {
            }
        });
    }

        // 获取随机整数
    function getRandomInt(m, n) {
        return Math.floor(Math.random() * (n - m + 1)) + m;
    }

    function getWeek() {
        return new Date().getDay();
    }


    ChatRoom.repeat = function (e) {
        let t = "";
        $.ajax({
            url: Label.servePath + "/cr/raw/" + e,
            method: "get",
            async: !1,
            success: function (e) {
                t = e.replace(/(<!--).*/g, "")
            }
        }), ChatRoom.editor.setValue(t), ChatRoom.send(0), $(window).scrollTop(0)
    };

    ChatRoom.plusOne = function () {
        ChatRoom.editor.setValue(Label.latestMessage), ChatRoom.send(0)
    };


    // 私信重连
    function reSevenSummer() {
        $("#noteMsgList").html('');
        PrivateWss.close();
        initPrivateChannel();
    }

    // 渲染记事本
    if (tongji_flag > 0) {
        var personInfo = $(".side").eq(0).find(".person-info").eq(0);
        personInfo.after('<div class="module note" style="width: 100%;height: 200px;overflow: hidden;"><div class=""><div type="text" style="width: 100%;height: 30px;padding: 5px 55px 5px 10px;box-sizing: border-box;border: 1px solid #eee;font-size: 12px;background-color: #000;color: #FFF;">精灵消息<span style="position: absolute;right: 10px;cursor: pointer;" id="reconnectSevenSummer">重连</span></div></div>');
        $(".note").eq(0).append('<div id="noteMsgList" style="width: 100%;height: 180px;overflow-y: scroll;"></div>');
    }

    $("#reconnectSevenSummer").click(function() {
        $("#noteMsgList").html('');
        if (PrivateWss) {
            PrivateWss.close();
        }
        initPrivateChannel();
    });

    // 监听私信
    // Label.node.apiKey
    let privateChatHB;
    var PrivateWss;
    function initPrivateChannel() {
        getFirstPageMsg();
        // console.info('tongji_flag_f', tongji_flag);
        if (tongji_flag < 0) {
            return;
        }
        PrivateWss = new WebSocket("wss://fishpi.cn/chat-channel?apiKey=" + Label.node.apiKey + "&toUser=its21f");
        PrivateWss.onopen = function() {
            renderNoteMsg("摸鱼帮小管家已连接……")
        }
        ,
        PrivateWss.onmessage = function(e) {
            var t = JSON.parse(e.data);
            if (!t.markdown) {
                return
            }
            window.localStorage['oldMsgTime'] = t.oId;
            renderNoteMsg(t.markdown);
        }
        ,
        PrivateWss.onclose = function() {
            renderNoteMsg("精灵失去连接，请点击重连，重连后，私信消息将清空")
        }
        ,
        PrivateWss.onerror = function(e) {
            console.log("ERROR", e)
        }
    }

    /**
     * 获取前20条消息
     */
    function getFirstPageMsg() {
        $.ajax({
            url: "https://fishpi.cn/chat/get-message?apiKey=" + Label.node.apiKey + "&toUser=its21f&page=1&pageSize=20",
            type: "GET",
            async: false,
            success: function (e) {
                var arr = e.data;
                // arr倒序
                arr.reverse();
                for (let i = 0; i < arr.length; i++) {
                    // 渲染消息
                    var msg = arr[i].markdown;
                    var time = arr[i].oId;
                    if (time > oldMsgTime) {
                        renderNoteMsg(msg);
                    }
                }
                // 更新将本地内存中oldMsgTime的值
                oldMsgTime = arr[arr.length - 1].oId;
                window.localStorage['oldMsgTime'] = oldMsgTime;
            }
        });
    }

    // 渲染记事本消息
    function renderNoteMsg(e) {
        $("#noteMsgList").prepend('<div class="allNoteMsg" style="display: flex;margin: 10px;"><div class="ice-msg-content" style="position: relative;background-color: var(--background-secondary-color);border-radius: 5px;padding: 8px 15px;overflow: initial;max-width: 100%;font-size: 12px;box-sizing: border-box;">' + e + '<div class="fn__right" style="margin-top: 5px; font-size: 10px;">'+new Date().toLocaleString()+'</div></div></div>')
    }

    async function waitWss(e) {
        if (e != 1) {
            while (!ChatRoomChannel.ws) {
                console.log('等待连接...');
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
            console.log('聊天室已连接');
        }
        if (ChatRoomChannel.ws || e == 1) {
            ChatRoomChannel.ws.onmessage = function(e) {
                var n = JSON.parse(e.data);
                if (zspdFlag) {
                    n.sysMetal = "";
                }
                switch (n.type) {
                case "barrager":
                    let e = n.barragerContent
                    , a = n.barragerColor
                    , o = n.userName
                    , s = n.userAvatarURL
                    , r = n.userNickname
                    , i = "";
                    i = "" != r && null != r ? r + ": " + e : o + ": " + e;
                    let l = {
                        img: s,
                        info: i,
                        href: Label.servePath + "/member/" + o,
                        close: !1,
                        speed: Math.round(10 * Math.random() + 10),
                        color: a
                    };
                    $("body").barrager(l);
                    break;
                case "discussChanged":
                    let c = n.whoChanged
                    , d = n.newDiscuss
                    , m = "<div class='newDiscussNotice' style='color: rgb(50 50 50);margin-bottom: 12px;text-align: center;display: none;'><svg><use xlink:href='#pound'></use></svg>&nbsp;<a href=\"" + Label.servePath + "/member/" + c + '" target="_blank">' + c + "</a> 编辑了话题：<a href='javascript:void(0)' style='text-decoration: none'>" + d + "</a></div>";
                    $("#chats").prepend(m),
                    $(".newDiscussNotice").slideDown(500),
                    $("#discuss-title").text(d);
                    break;
                case "redPacketStatus":
                    let h, f = n.whoGive, p = n.whoGot, g = n.got, v = n.count, u = n.oId, b = n.dice;
                    if (null == b)
                        h = '<a href="' + Label.servePath + "/member/" + p + '" target="_blank">' + p + '</a> 抢到了 <a href="' + Label.servePath + "/member/" + f + '" target="_blank">' + f + '</a> 的 <a style="cursor: pointer" onclick="ChatRoom.unpackRedPacket(\'' + u + "')\">红包</a>";
                    else {
                        let e;
                        switch (b.bet) {
                        case "big":
                            e = "大";
                            break;
                        case "small":
                            e = "小";
                            break;
                        case "leopard":
                            e = "豹子"
                        }
                        let n = b.chips;
                        h = '<a href="' + Label.servePath + "/member/" + p + '" target="_blank">' + p + '</a> 在 <a href="' + Label.servePath + "/member/" + f + '" target="_blank">' + f + '</a> 的 <a style="cursor: pointer" onclick="ChatRoom.bet(\'' + u + "')\">盘口</a> 下注" + n + "积分买" + e
                    }
                    g === v ? ($("#chatroom" + n.oId).find(".hongbao__item").css("opacity", ".36"),
                    $("#chatroom" + u).find(".hongbao__item").hasClass("opened") || $("#chatroom" + u).find(".hongbao__item").addClass("opened"),
                    $("#chatroom" + n.oId + " .hongbao__item").removeAttr("onclick").attr("onclick", "ChatRoom.unpackRedPacket(" + u + ");"),
                    $("#chatroom" + n.oId).find(".redPacketDesc").html("已经被抢光啦"),
                    h += null == b ? "，红包已被领完 (" + g + "/" + v + ")" : "，已封盘 (" + g + "/" + v + ")") : h += " (" + g + "/" + v + ")";
                    let w = "<div class='redPacketNotice' style='color: rgb(50 50 50);margin-bottom: 12px;text-align: center;display: none;'><svg><use xlink:href='#redPacketIcon'></use></svg>&nbsp;" + h + "</div>";
                    $("#chats").prepend(w),
                    $(".redPacketNotice").slideDown(500);
                    break;
                case "online":
                    for (var t in $("#discuss-title").text(n.discussing),
                    $("#onlineCnt").text(n.onlineChatCnt),
                    $("#indexOnlineChatCnt").text(n.onlineChatCnt),
                    Label.onlineAvatarData = "",
                    n.users) {
                        let e = n.users[t];
                        Label.onlineAvatarData += '<a target="_blank" data-name="' + e.userName + '"\nhref="' + e.homePage + '">\n<img style=\'margin-bottom: 10px\' class="avatar avatar-small" aria-label="' + e.userName + '"\nsrc="' + e.userAvatarURL48 + '">\n</a>'
                    }
                    Util.listenUserCard();
                    break;
                case "revoke":
                    $("#chatroom" + n.oId).remove(),
                    $("#chatindex" + n.oId).remove();
                    break;
                case "refresh":
                    ChatRoom.flashScreen();
                    break;
                case "customMessage":
                    var aptx = "<div class='customNotice' style='color: rgb(118 118 118);margin-bottom: 12px;text-align: center;display: none;'>" + '官方礼仪-哀酱说：请注意，贵宾VIP即将动身💓' + "</div>";
                    $("#chats").prepend(aptx),
                    $(".customNotice").slideDown(500);
                    let C = "<div class='customNotice' style='color: rgb(118 118 118);margin-bottom: 12px;text-align: center;display: none;'>" + n.message + "</div>";
                    $("#chats").prepend(C),
                    $(".customNotice").slideDown(500);
                    break;
                case "refreshBarrager":
                    $("#barragerCost").text(n.cost),
                    $("#barragerUnit").text(n.unit);
                    break;
                case "msg":
                    // 此处监听特别关注列表用户
                    if (focus_users.includes(n.userName)) {
                        var notificat = new Notification('特别关注：', {
                            dir: 'rtl', //dir : 文字的方向；它的值可以是 auto（自动）, ltr（从左到右）, or rtl（从右到左）
                            body: n.userName + ' 出现了，快来跟TA互动吧'//body: 通知中额外显示的字符串
                        });
                    }
                    0 === $("#chatRoomIndex").length && $("#chatroom" + n.oId).length <= 0 && (ChatRoom.renderMsg(n),
                    ChatRoom.resetMoreBtnListen()),
                    0 !== $("#chatRoomIndex").has("#emptyChatRoom").length && $("#emptyChatRoom").remove();
                    let k = n.userNickname
                    , x = n.userName;
                    k = void 0 !== k && "" !== k ? k + " (" + x + ")" : x;
                    let R = n.content;
                    -1 !== R.indexOf('"msgType":"redPacket"') && (R = "[收到红包，请在完整版聊天室查看]"),
                    -1 !== R.indexOf('"msgType":"weather"') && (R = "[天气卡片，请在完整版聊天室查看]"),
                    -1 !== R.indexOf('"msgType":"music"') && (R = "[音乐卡片，请在完整版聊天室查看]"),
                    $("#chatRoomIndex").prepend('<li class="fn-flex" id="chatindex' + n.oId + '" style=\'display: none; border-bottom: 1px solid #eee;\'>\n    <a rel="nofollow" href="/member/' + n.userName + '">\n        <div class="avatar tooltipped tooltipped-n"\n             aria-label="' + n.userName + '"\n             style="background-image:url(\'' + n.userAvatarURL48 + '\')"></div>\n    </a>\n    <div class="fn-flex-1">\n        <div class="ft-smaller">\n            <a rel="nofollow" href="/member/' + n.userName + '">\n                <span class="ft-gray">' + k + '</span>\n            </a>\n        </div>\n        <div class="vditor-reset comment ' + Label.chatRoomPictureStatus + '">\n            ' + ChatRoomChannel.filterContent(R) + "\n        </div>\n    </div>\n</li>"),
                    11 === $("#chatRoomIndex li.fn-flex").length && $("#chatRoomIndex li.fn-flex:last").fadeOut(199, (function() {
                        $("#chatRoomIndex li.fn-flex:last").remove()
                    }
                    )),
                    $("#chatRoomIndex li:first").slideDown(200),
                    Util.listenUserCard(),
                    "object" == typeof ChatRoom && ChatRoom.imageViewer()
                }
            }
        } else {console.info('消息监听失败')}
        if (e != 1) {
            console.info('tongji_flag', tongji_flag);
            if (tongji_flag > 0) {
                initPrivateChannel();
            }
        }
    }

    $("#fishDetail").click(function() {
        var bstr = fish_tongji.byDateStr ? fish_tongji.byDateStr : '很久之前';
        // 收益统计
        Util.alert("" +
            "<div class=\"form fn__flex-column\">\n" +
            "<label>\n" +
            "<div style=\"text-align: left;\"><b>上次暴雨梨花针施放时间："+bstr+"</b></div>" +
            "<table cellspacing=\"0\" border=\"1\"><tbody>" +
            "   <tr><th>叉得鱼翅</th><th>biu得鱼翅</th><th>biu得鱼丸</th><th>暴雨梨花</th></tr>" +
            "   <tr><td>"+fish_tongji.yuchi+"</td><td>"+fish_tongji.biuYuchi+"</td><td>"+fish_tongji.yuwan+"</td><td>"+fish_tongji.byYuchi+"</td></tr>" +
            "   <tr><th>橙色鱼叉</th><th>紫色鱼叉</th><th>白色鱼叉</th><th>五换一</th></tr>" +
            "   <tr><td>"+fish_tongji.chengse+"</td><td>"+fish_tongji.zise+"</td><td>"+fish_tongji.baise+"</td><td>"+fish_tongji.five2one+"</td></tr>" +
            "   <tr><th>捡鱼叉</th><th>欢乐时光</th><th>口令红包</th><th>鱼叉净收益</th></tr>" +
            "   <tr><td>"+fish_tongji.cishu+"</td><td>"+fish_tongji.huanle+"</td><td>"+fish_tongji.kouling+"</td><td>"+fish_tongji.total+"</td></tr>" +
            "</tbody>\n" +
            "</table>\n" +
            "</label>\n" +
            "<div class=\"fn-hr5\"></div>\n" +
            "<table><tr><th>背包鱼翅：" + fish_tongji.bagChi + "</th><th>背包鱼丸："+fish_tongji.bagWan+"</th><th>背包鱼叉：["+fish_tongji.yuchaList.join('')+"]"+ fish_tongji.bagCha +"/10</th></tr></table>" +
            "<div class=\"fn__flex\" style=\"margin-top: 15px; justify-content: flex-end;\">\n" +
            "  <button class=\"btn btn--confirm\" onclick='Util.copyTongji();'>复制</button>\n" +
            "  <button class=\"btn btn--confirm\" style=\"margin-left: 10px;\" onclick='Util.reTongji();'>重置</button>\n" +
            "</div>\n" +
            "</div>" +
            "", "渔场游戏收益统计：[" + fish_tongji.dateStr + "]开始");
    });

    // 复制统计内容
    Util.copyTongji = async function copyTongji() {
        var text = "渔场游戏收益统计：[" + fish_tongji.dateStr + "]开始\n";
        text += "| 叉得鱼翅 | biu得鱼翅 | biu得鱼丸 | 暴雨梨花 |\n";
        text += "|-------|-------|-------|-------|\n";
        text += "| "+ fish_tongji.yuchi +" | "+fish_tongji.biuYuchi+" | "+fish_tongji.yuwan+" | "+fish_tongji.byYuchi+" |\n";
        text += "| 橙色鱼叉 | 紫色鱼叉 | 白色鱼叉 | 五换一 |\n";
        text += "| "+fish_tongji.chengse+" | "+fish_tongji.zise+" | "+fish_tongji.baise+" | "+fish_tongji.five2one+" |\n";
        text += "| 捡鱼叉 | 欢乐时光 | 口令红包 | 鱼叉净收益 |\n";
        text += "| "+fish_tongji.cishu+" | "+fish_tongji.huanle+" | "+fish_tongji.kouling+" | "+fish_tongji.total+" |\n";
        await navigator.clipboard.writeText(text);
        Util.closeAlert();
    }
    waitWss();


    GM_addStyle('#robotBox #robotMsgList, #noteMsgList {scrollbar-width: none;}');

})();
