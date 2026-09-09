'use client';
import { createContext, useContext, useEffect, useState } from 'react';
export type Locale='en'|'th'|'zh-CN'|'zh-TW'|'ru';
export const languages:Record<Locale,string>={en:'English',th:'ไทย','zh-CN':'简体中文','zh-TW':'繁體中文',ru:'Русский'};
const sharedLocaleCookie='af_locale';
const localeOverrideCookie='af_locale_override';
function browserLocale():Locale{const value=(navigator.languages?.[0]||navigator.language||'en').toLowerCase();return value.startsWith('th')?'th':value.startsWith('zh')?(value.includes('tw')||value.includes('hk')||value.includes('mo')?'zh-TW':'zh-CN'):value.startsWith('ru')?'ru':'en';}
export function memberLocale(value?:string|null):Locale{const normalized=String(value||'').trim().toLowerCase();if(normalized==='auto')return browserLocale();if(normalized==='zh-hans'||normalized==='zh-cn'||normalized==='zh')return 'zh-CN';if(normalized==='zh-hant'||normalized==='zh-tw'||normalized==='zh-hk')return 'zh-TW';if(normalized==='th'||normalized==='ru')return normalized;return 'en';}
function cookieValue(name:string){const value=document.cookie.split(';').map(item=>item.trim()).find(item=>item.startsWith(`${name}=`))?.split('=').slice(1).join('=');return value?decodeURIComponent(value):null;}
export function hasLocaleOverride(){return Boolean(cookieValue(localeOverrideCookie));}
export function clearLocaleOverride(){const secure=location.protocol==='https:'?'; Secure':'';document.cookie=`${localeOverrideCookie}=; Path=/; Max-Age=0; SameSite=Lax${secure}`;}
function persistLocaleOverride(value:Locale){const secure=location.protocol==='https:'?'; Secure':'';document.cookie=`${localeOverrideCookie}=${value}; Path=/; SameSite=Lax${secure}`;}
// English is the stable message key. Customer-authored messages are never translated.
const rows=`
retail|สมาชิกทั่วไป|零售会员|零售會員|Розничный клиент
wholesale|สมาชิกค้าส่ง|批发会员|批發會員|Оптовый клиент
direct|เข้าโดยตรง|直接访问|直接造訪|Прямой переход
website|เว็บไซต์|品牌网站|品牌網站|Сайт
verify|ตรวจสอบ|验证页|驗證頁|Проверка
First source|ที่มาครั้งแรก|首次来源|首次來源|Первый источник
Browser language|ภาษาของเบราว์เซอร์|浏览器语言|瀏覽器語言|Язык браузера
Menu|เมนู|菜单|選單|Меню
This visitor has opened support.|ผู้เยี่ยมชมเปิดแชตแล้ว|访客已打开客服。
Their first message will appear here.|ข้อความแรกจะปรากฏที่นี่|第一条消息会显示在这里。
Support|ฝ่ายดูแลลูกค้า|客户支持|客戶支援|Поддержка
Inbox|กล่องข้อความ|收件箱|收件匣|Входящие
Local preview|ตัวอย่างในเครื่อง|本地预览|本機預覽|Локальный просмотр
LOCAL PREVIEW|ตัวอย่างในเครื่อง|本地预览|本機預覽|ЛОКАЛЬНЫЙ ПРОСМОТР
Language|ภาษา|语言|語言|Язык
Sign in|เข้าสู่ระบบ|登录|登入|Войти
Sign out|ออกจากระบบ|退出登录|登出|Выйти
Member account|บัญชีสมาชิก|会员账户|會員帳戶|Аккаунт
Continue as a sample member|ดำเนินการด้วยสมาชิกตัวอย่าง|以示例会员继续|以範例會員繼續|Войти как тестовый участник
Preview sign-in|เข้าสู่ระบบตัวอย่าง|预览登录|預覽登入|Тестовый вход
No password needed. This only loads a sample member, order and cart.|ไม่ต้องใช้รหัสผ่าน จะแสดงสมาชิก คำสั่งซื้อ และตะกร้าตัวอย่างเท่านั้น|无需密码，仅载入示例会员、订单和购物车。|無需密碼，僅載入範例會員、訂單和購物車。|Пароль не нужен. Загрузятся только тестовый аккаунт, заказ и корзина.
Your conversation|บทสนทนาของคุณ|你的对话|你的對話|Ваш диалог
Here with you.|เราพร้อมดูแลคุณ|我们在这里，为你解答。|我們在這裡，為你解答。|Мы рядом.
Ask a question, share a product, or tell us what you need.|ถามคำถาม แชร์สินค้า หรือบอกสิ่งที่คุณต้องการ|问一个问题，分享一件商品，或告诉我们你需要什么帮助。|提出問題、分享商品，或告訴我們你需要什麼協助。|Задайте вопрос, поделитесь товаром или расскажите, чем помочь.
Support is online|เจ้าหน้าที่ออนไลน์|客服在线|客服在線|Поддержка онлайн
Leave a message. We’ll take it from here.|ฝากข้อความไว้ เราจะดูแลต่อให้|请留言，我们会为你跟进。|請留言，我們會為你跟進。|Оставьте сообщение — мы ответим.
Connecting to support…|กำลังเชื่อมต่อ…|正在连接客服…|正在連線客服…|Подключение…
Reconnect|เชื่อมต่ออีกครั้ง|重新连接|重新連線|Подключить снова
Reconnecting… Your messages are saved.|กำลังเชื่อมต่อใหม่ ข้อความของคุณถูกบันทึกแล้ว|正在重连，消息已保存。|正在重新連線，訊息已儲存。|Переподключение. Сообщения сохранены.
Connection interrupted. Your messages are saved on this device.|การเชื่อมต่อขัดข้อง ข้อความถูกบันทึกไว้ในอุปกรณ์นี้|连接中断，消息已保存在此设备上。|連線中斷，訊息已儲存在此裝置上。|Связь прервана. Сообщения сохранены на устройстве.
Support is temporarily unavailable. Please reconnect.|บริการไม่พร้อมชั่วคราว โปรดเชื่อมต่อใหม่|客服暂时无法连接，请重连。|客服暫時無法連線，請重新連線。|Поддержка временно недоступна. Подключитесь снова.
Your message|ข้อความของคุณ|你的消息|你的訊息|Ваше сообщение
Type your message…|พิมพ์ข้อความ…|输入消息…|輸入訊息…|Введите сообщение…
Send message|ส่งข้อความ|发送消息|傳送訊息|Отправить сообщение
Just you and our support team|ระหว่างคุณกับทีมดูแลลูกค้าเท่านั้น|仅你和客服团队可见|僅你和客服團隊可見|Видно только вам и поддержке
Enter to send · Shift + Enter for a new line|Enter เพื่อส่ง · Shift + Enter เพื่อขึ้นบรรทัดใหม่|Enter 发送 · Shift + Enter 换行|Enter 傳送 · Shift + Enter 換行|Enter — отправить · Shift + Enter — новая строка
This conversation is closed. Sending a message will reopen it.|บทสนทนาปิดแล้ว ส่งข้อความเพื่อเปิดอีกครั้ง|会话已关闭，发送消息即可重新开启。|對話已關閉，傳送訊息即可重新開啟。|Диалог закрыт. Новое сообщение откроет его снова.
You|คุณ|你|你|Вы
Visitor|ผู้เยี่ยมชม|访客|訪客|Посетитель
Read|อ่านแล้ว|已读|已讀|Прочитано
Sent|ส่งแล้ว|已发送|已傳送|Отправлено
Sending…|กำลังส่ง…|发送中…|傳送中…|Отправка…
Waiting for connection|รอการเชื่อมต่อ|等待连接|等待連線|Ожидание подключения
Not sent · Retry|ส่งไม่สำเร็จ · ลองอีกครั้ง|发送失败 · 重试|傳送失敗 · 重試|Не отправлено · Повторить
New messages ↓|ข้อความใหม่ ↓|新消息 ↓|新訊息 ↓|Новые сообщения ↓
Support is typing…|เจ้าหน้าที่กำลังพิมพ์…|客服正在输入…|客服正在輸入…|Поддержка печатает…
Visitor is typing…|ผู้เยี่ยมชมกำลังพิมพ์…|访客正在输入…|訪客正在輸入…|Посетитель печатает…
Conversation messages|ข้อความในบทสนทนา|聊天记录|對話記錄|Сообщения диалога
Automatic reply|ตอบกลับอัตโนมัติ|自动回复|自動回覆|Автоответ
Your details|ข้อมูลของคุณ|你的信息|你的資訊|Ваши данные
Close|ปิด|关闭|關閉|Закрыть
Cancel|ยกเลิก|取消|取消|Отмена
Preview|ตัวอย่าง|预览|預覽|Просмотр
Sample|ตัวอย่าง|示例|範例|Пример
Orders|คำสั่งซื้อ|订单|訂單|Заказы
Your latest order|คำสั่งซื้อล่าสุดของคุณ|你的最新订单|你的最新訂單|Последний заказ
Preparing|กำลังจัดเตรียม|备货中|備貨中|Готовится
Ask about this order|สอบถามคำสั่งซื้อนี้|咨询此订单|詢問此訂單|Спросить о заказе
Order shared|แชร์คำสั่งซื้อแล้ว|订单已分享|訂單已分享|Заказ отправлен
Cart|ตะกร้า|购物车|購物車|Корзина
Share cart|แชร์ตะกร้า|分享购物车|分享購物車|Поделиться корзиной
Cart shared|แชร์ตะกร้าแล้ว|购物车已分享|購物車已分享|Корзина отправлена
Sign in to preview your orders and cart.|เข้าสู่ระบบตัวอย่างเพื่อดูคำสั่งซื้อและตะกร้า|登录预览账户，查看订单和购物车。|登入預覽帳戶，查看訂單和購物車。|Войдите в тестовый аккаунт, чтобы увидеть заказы и корзину.
Currently viewing|กำลังดู|正在浏览|正在瀏覽|Сейчас просматривает
Share product|แชร์สินค้า|分享商品|分享商品|Поделиться товаром
Product shared|แชร์สินค้าแล้ว|商品已分享|商品已分享|Товар отправлен
Product details|รายละเอียดสินค้า|商品信息|商品資訊|О товаре
Product page|หน้าสินค้า|商品页面|商品頁面|Страница товара
View product preview|ดูหน้าสินค้าตัวอย่าง|查看商品预览|查看商品預覽|Открыть товар
Product page preview|ตัวอย่างหน้าสินค้า|商品页面预览|商品頁面預覽|Просмотр страницы товара
Ask about this product|สอบถามสินค้านี้|咨询此商品|詢問此商品|Спросить о товаре
Back to support|กลับไปที่แชต|返回客服|返回客服|Вернуться в чат
Source page|หน้าที่มา|来源页面|來源頁面|Страница перехода
Direct visit|เข้าโดยตรง|直接访问|直接造訪|Прямой переход
Items|รายการ|件商品|件商品|Товары
Preview items only. No purchase is made.|สินค้าตัวอย่างเท่านั้น ไม่มีการสั่งซื้อจริง|仅为示例商品，不会产生购买。|僅為範例商品，不會產生購買。|Только тестовые товары. Покупка не совершается.
Open Inbox|เปิดกล่องข้อความ|打开收件箱|開啟收件匣|Открыть входящие
Saved|บันทึกแล้ว|已保存|已儲存|Сохранено
Save changes|บันทึกการเปลี่ยนแปลง|保存更改|儲存變更|Сохранить
Save failed. Please try again.|บันทึกไม่สำเร็จ โปรดลองอีกครั้ง|保存失败，请重试。|儲存失敗，請重試。|Не удалось сохранить. Повторите попытку.
Write a message of 1–4,000 characters.|กรุณาเขียนข้อความ 1–4,000 ตัวอักษร|请输入 1–4,000 个字符。|請輸入 1–4,000 個字元。|Введите от 1 до 4000 символов.
Unable to save this message.|ไม่สามารถบันทึกข้อความนี้ได้|无法保存消息。|無法儲存訊息。|Не удалось сохранить сообщение.
Draft storage unavailable. Keep this page open.|ไม่สามารถบันทึกร่างได้ โปรดเปิดหน้านี้ไว้|无法保存草稿，请保持页面打开。|無法儲存草稿，請保持頁面開啟。|Черновик не сохранён. Не закрывайте страницу.
Operations|งานดูแลลูกค้า|运营后台
WORKSPACE|พื้นที่ทำงาน|工作空间
Settings|การตั้งค่า|设置
Appearance|รูปแบบ|外观
Light mode|โหมดสว่าง|浅色模式
Dark mode|โหมดมืด|深色模式
Connected|เชื่อมต่อแล้ว|已连接
Reconnecting|กำลังเชื่อมต่อใหม่|正在重连
Conversations|บทสนทนา|会话
A direct line to your customers.|ดูแลทุกบทสนทนาของลูกค้า|在这里处理每一次客户咨询。
Search conversations|ค้นหาบทสนทนา|搜索会话
Open|เปิดอยู่|进行中
Unread|ยังไม่อ่าน|未读
Mine|ของฉัน|我的
Closed|ปิดแล้ว|已关闭
All|ทั้งหมด|全部
Unassigned|ยังไม่มอบหมาย|未分配
Opened support · waiting for a message|เปิดแชตแล้ว · รอข้อความ|已打开客服 · 等待消息
You’re all caught up|อ่านข้อความครบแล้ว|暂无未读消息
No conversations here|ไม่มีบทสนทนา|暂无会话
Try another search.|ลองค้นหาด้วยคำอื่น|试试其他关键词。
New visitor messages will appear here.|ข้อความใหม่จะปรากฏที่นี่|访客的新消息会显示在这里。
Sample data included|มีข้อมูลตัวอย่าง|含示例数据
Reply to visitor|ตอบผู้เยี่ยมชม|回复访客
Write a reply…|เขียนคำตอบ…|输入回复…
Send reply|ส่งคำตอบ|发送回复
Reply visible to the visitor|ผู้เยี่ยมชมจะเห็นคำตอบนี้|回复内容对访客可见
Visitor details|ข้อมูลผู้เยี่ยมชม|访客详情
Back to conversations|กลับไปที่บทสนทนา|返回会话列表
Close conversation|ปิดบทสนทนา|关闭会话
Reopen conversation|เปิดบทสนทนาอีกครั้ง|重新开启会话
Reopen|เปิดอีกครั้ง|重新开启
Anonymous visitor|ผู้เยี่ยมชมที่ไม่ระบุชื่อ|匿名访客
Online now|ออนไลน์อยู่|当前在线
Offline|ออฟไลน์|离线
Conversation|บทสนทนา|会话
Assigned to|มอบหมายให้|分配给
Channel|ช่องทาง|渠道
Website|เว็บไซต์|网站
Web support|แชตบนเว็บไซต์|网页客服
Started|เริ่มเมื่อ|开始时间
Visitor information|ข้อมูลผู้เยี่ยมชม|访客信息
Visitor ID|รหัสผู้เยี่ยมชม|访客 ID
First seen|เข้าครั้งแรก|首次访问
Last seen|เข้าล่าสุด|最近访问
Source|ที่มา|来源
Customer|ลูกค้า|客户
Not linked|ยังไม่เชื่อมโยง|未关联
Link this conversation to a customer once their identity is confirmed.|เชื่อมโยงลูกค้าเมื่อยืนยันตัวตนแล้ว|确认客户身份后，可关联此会话。
Link sample customer|เชื่อมโยงลูกค้าตัวอย่าง|关联示例客户
View sample profile|ดูโปรไฟล์ตัวอย่าง|查看示例资料
Unlink customer|ยกเลิกการเชื่อมโยง|取消关联
Sample customer|ลูกค้าตัวอย่าง|示例客户
Choose sample customer|เลือกลูกค้าตัวอย่าง|选择示例客户
Confirm link|ยืนยันการเชื่อมโยง|确认关联
Preview fixtures only. No production customer records are accessed.|ข้อมูลตัวอย่างเท่านั้น ไม่เข้าถึงข้อมูลลูกค้าจริง|仅使用预览数据，不读取真实客户记录。
Sample customer profile|โปรไฟล์ลูกค้าตัวอย่าง|示例客户资料
Read-only fixture for this local preview.|ข้อมูลตัวอย่างแบบอ่านอย่างเดียว|本地预览的只读示例资料。
Customer user ID|รหัสผู้ใช้ลูกค้า|客户用户 ID
Membership|สมาชิก|会员
Illustrative conversation|บทสนทนาตัวอย่าง|示例会话
Conversation and linked sample customer.|บทสนทนาและลูกค้าตัวอย่างที่เชื่อมโยง|会话及已关联的示例客户。
About this preview|เกี่ยวกับตัวอย่างนี้|关于此预览
Preview support agent|เจ้าหน้าที่ตัวอย่าง|预览客服
Preview agent|เจ้าหน้าที่ตัวอย่าง|预览客服身份
Open visitor chat|เปิดแชตผู้เยี่ยมชม|打开访客聊天页
Your support space|พื้นที่ดูแลลูกค้า|你的客服工作台
Choose a conversation, or open the visitor chat|เลือกบทสนทนาหรือเปิดแชตผู้เยี่ยมชม|选择会话，或打开访客聊天页
and send your first message.|และส่งข้อความแรก|并发送第一条消息。
Isolated from production systems.|แยกจากระบบจริง|与正式系统隔离。
Quick replies|คำตอบสำเร็จรูป|快捷回复
Auto replies|ตอบกลับอัตโนมัติ|自动回复
Knowledge base|คลังความรู้|知识库
Search answers|ค้นหาคำตอบ|搜索答案
Insert reply|แทรกคำตอบ|插入回复
No matching answers|ไม่พบคำตอบ|未找到答案
Manage replies|จัดการคำตอบ|管理回复
Edit an answer before sending.|แก้ไขคำตอบได้ก่อนส่ง|插入后可编辑，确认后再发送。
Add reply|เพิ่มคำตอบ|添加回复
Add article|เพิ่มบทความ|添加文章
Title|ชื่อเรื่อง|标题
Answer|คำตอบ|回复内容
Content language|ภาษาของเนื้อหา|内容语言
Delete|ลบ|删除
Published|เผยแพร่|已发布
Draft|ฉบับร่าง|草稿
Publish for agents|เผยแพร่ให้เจ้าหน้าที่|发布给客服
Welcome reply|ข้อความต้อนรับ|欢迎回复
Send once after the first visitor message.|ส่งหนึ่งครั้งหลังข้อความแรกของผู้เยี่ยมชม|访客发送第一条消息后，自动发送一次。
Away reply|ข้อความเมื่อไม่อยู่|离线回复
Send when no agent is online; at most once every 15 minutes.|ส่งเมื่อไม่มีเจ้าหน้าที่ออนไลน์ สูงสุดหนึ่งครั้งใน 15 นาที|无人在线时发送，每个会话最多每 15 分钟一次。
Enable|เปิดใช้งาน|启用
Save settings to apply them to this local preview.|บันทึกการตั้งค่าเพื่อใช้ในตัวอย่างนี้|保存后会应用到此本地预览。
Unsaved changes|ยังไม่ได้บันทึก|更改尚未保存
No replies yet. Add your first answer.|ยังไม่มีคำตอบ เพิ่มคำตอบแรก|暂无快捷回复，添加第一条吧。
No articles yet.|ยังไม่มีบทความ|暂无知识库文章。
Article content|เนื้อหาบทความ|文章内容
Sample member|สมาชิกตัวอย่าง|示例会员|範例會員|Тестовый участник
Member context|ข้อมูลสมาชิก|会员信息
Customer activity|กิจกรรมของลูกค้า|客户动态
No shared context yet.|ยังไม่มีข้อมูลที่แชร์|尚无共享信息。
Member, order and cart data are samples.|สมาชิก คำสั่งซื้อ และตะกร้าเป็นข้อมูลตัวอย่าง|会员、订单和购物车均为示例数据。|會員、訂單和購物車均為範例資料。|Аккаунт, заказ и корзина содержат тестовые данные.
In production, this opens the existing Operations customer record. Chat does not store a copy of the customer profile.|ในระบบจริง จะเปิดข้อมูลลูกค้าที่มีอยู่ใน Operations โดยแชตไม่เก็บสำเนา|正式接入后，将打开 Operations 中的客户档案，聊天系统不保存客户资料副本。
Changing the preview agent affects other Inbox tabs in this browser.|การเปลี่ยนเจ้าหน้าที่มีผลกับแท็บกล่องข้อความอื่นในเบราว์เซอร์นี้|切换身份会影响此浏览器中的其他收件箱标签页。
Messages are saved on this computer and shared between the visitor page and this Inbox. Sample conversations and customers are marked.|ข้อความบันทึกในเครื่องนี้และเชื่อมระหว่างหน้าแชตกับกล่องข้อความ มีป้ายกำกับข้อมูลตัวอย่าง|消息保存在本机，并在访客页与收件箱间同步，示例会话和客户均有标记。
This preview does not sign in to Operations or access Flower Database. Production staff permissions and Supabase Realtime will be connected in a later phase.|ตัวอย่างนี้ไม่เข้าสู่ Operations หรือ Flower Database การเชื่อมต่อสิทธิ์พนักงานและข้อมูลจริงจะทำภายหลัง|此预览不登录正式 Operations，也不访问 Flower Database，真实员工权限与实时数据将在后续接入。
Support Chat v1|ระบบแชต v1|客服聊天 v1
A dedicated space for every conversation.|ดูแลทุกบทสนทนา|专注每一次对话。
Unable to update.|ไม่สามารถอัปเดตได้|无法更新。
Conversation reopened|เปิดบทสนทนาอีกครั้งแล้ว|会话已重新开启|對話已重新開啟|Диалог открыт снова
Assignment removed|ยกเลิกการมอบหมายแล้ว|已取消分配|已取消分配|Назначение снято
Assigned to {name}|มอบหมายให้ {name}|已分配给 {name}|已分配給 {name}|Назначено: {name}
{name} closed the conversation|{name} ปิดบทสนทนา|{name} 关闭了会话|{name} 關閉了對話|{name} закрыл(а) диалог
{name} reopened the conversation|{name} เปิดบทสนทนาอีกครั้ง|{name} 重新开启了会话|{name} 重新開啟了對話|{name} открыл(а) диалог
Sample customer linked by {name}|{name} เชื่อมโยงลูกค้าตัวอย่าง|{name} 关联了示例客户|{name} 關聯了範例客戶|{name} привязал(а) тестового клиента
Sample customer unlinked by {name}|{name} ยกเลิกการเชื่อมโยงลูกค้า|{name} 取消了示例客户关联|{name} 取消了範例客戶關聯|{name} отвязал(а) тестового клиента
Keywords|คีย์เวิร์ด|关键词
Opening settings…|กำลังเปิดการตั้งค่า…|正在打开设置…|正在開啟設定…|Открываем настройки…
Back to Inbox|กลับไปที่กล่องข้อความ|返回收件箱|返回收件匣|Назад в Inbox
Local configuration preview. These rules are not connected to the assistant conversations yet.|ตัวอย่างการตั้งค่าในเครื่อง กฎเหล่านี้ยังไม่ได้เชื่อมกับแชตผู้ช่วย|本地配置预览；这些规则尚未连接到助手对话。|本機設定預覽；這些規則尚未連接到助理對話。|Локальное демо настроек. Правила пока не связаны с диалогами.
Separate keywords with commas|คั่นคีย์เวิร์ดด้วยจุลภาค|用逗号分隔关键词
Response type|ประเภทการตอบกลับ|回复类型
Direct answer|ตอบโดยตรง|直接回复
Multiple choice|หลายตัวเลือก|多个选项
Look up customer orders|ค้นหาคำสั่งซื้อของลูกค้า|查询客户订单
Question|คำถาม|问题
Options|ตัวเลือก|选项
One option per line|หนึ่งตัวเลือกต่อบรรทัด|每行一个选项
Automatic keyword reply|ตอบกลับคีย์เวิร์ดอัตโนมัติ|关键词自动回复
Order|คำสั่งซื้อ|订单
Shipped|จัดส่งแล้ว|已发货
`;
export const dictionary:Record<string,string[]> = Object.fromEntries(rows.trim().split('\n').map(row=>{const [key,...values]=row.split('|');return [key,values];}));
export function translate(key:string,locale:Locale){const clean=key.trim();const index=['th','zh-CN','zh-TW','ru'].indexOf(locale);const value= index<0?clean:dictionary[clean]?.[index]||clean;return key.replace(clean,value);}
const Context=createContext({locale:'en' as Locale,t:(s:string)=>s,setLocale:(_v:Locale)=>{},applyMemberPreference:(_v?:string|null)=>{},agent:false});
export function I18nProvider({children,agent=false}:{children:React.ReactNode;agent?:boolean}){
 const [locale,setState]=useState<Locale>('en');
 useEffect(()=>{const key=agent?'af-ops-language':'af-chat-language';let language:Locale='en';try{const override=agent?null:cookieValue(localeOverrideCookie),preference=agent?null:cookieValue(sharedLocaleCookie),saved=localStorage.getItem(key);if(override)language=memberLocale(override);else if(preference)language=memberLocale(preference);else if(saved&&saved in languages)language=saved as Locale;else language=browserLocale();}catch{}if(agent&&!['en','th','zh-CN'].includes(language))language=language==='zh-TW'?'zh-CN':'en';queueMicrotask(()=>setState(language));},[agent]);
 const setLocale=(value:Locale)=>{setState(value);try{localStorage.setItem(agent?'af-ops-language':'af-chat-language',value);if(!agent)persistLocaleOverride(value);}catch{}};
 const applyMemberPreference=(value?:string|null)=>{if(!agent&&!hasLocaleOverride())setState(memberLocale(value));};
 useEffect(()=>{document.documentElement.lang=locale;},[locale]);
 return <Context.Provider value={{locale,t:s=>translate(s,locale),setLocale,applyMemberPreference,agent}}>{children}</Context.Provider>;
}
export function useI18n(){return useContext(Context);}
export function LanguagePicker(){const {locale,setLocale,agent,t}=useI18n();return <select className="language-picker" aria-label={t('Language')} value={locale} onChange={e=>setLocale(e.target.value as Locale)}>{Object.entries(languages).filter(([key])=>!agent||['en','th','zh-CN'].includes(key)).map(([key,label])=><option key={key} value={key}>{label}</option>)}</select>;}
export function systemText(body:string,locale:Locale){for(const key of Object.keys(dictionary).filter(k=>k.includes('{name}'))){const [a,b]=key.split('{name}');if(body.startsWith(a)&&body.endsWith(b)){const name=body.slice(a.length,b.length?-b.length:undefined);return translate(key,locale).replace('{name}',name);}}return translate(body,locale);}
