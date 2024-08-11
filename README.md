## tianyi-chat

五六天的时间，自己从零到一完成了整个即时通讯聊天室全栈项目。总的来说遇到了很多问题也踩了很多坑，但是通过自己的思考与实践，许多问题也得以解决，希望自己以后仍能认真思考，多多实践吧🎊🎊🎊

## 项目功能

- 实现了登录鉴权功能，根据用户信息生成token并返还给前端，同时利用express-jwt来验证前端身份。✨
- 编写后端接口与API，同时配置MySQL，利用sql语句实现对用户信息与聊天记录的查询与更改。✨
- 后端通过存储在线用户的socket.id，加入聊天接受方的socket房间，实现私聊功能✨
- 利用pinia保存socket.io实例对象，利用实例对象的监听与触发事件来实现前后端即时通信。✨
- 渲染所有用户信息在前端界面，点击按钮用户可与所有用户进行聊天。✨
- 编写类型接口。定义对象结构，保障代码类型安全性。✨

## 界面

![屏幕截图 2024-08-11 110028.png](https://cdn.nlark.com/yuque/0/2024/png/40660095/1723347834327-ba391e00-feb6-43b8-bc7b-a124d06f2079.png#averageHue=%2358ba88&clientId=u05f70f10-bd09-4&from=ui&id=uced89bc9&originHeight=1412&originWidth=2553&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=142658&status=done&style=none&taskId=uff095209-4e4b-446c-9603-34253d68ec6&title=)
