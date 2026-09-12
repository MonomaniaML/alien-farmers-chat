import type { Locale as ContentLanguage } from '@/lib/support/i18n';
type LocalizedCopy=[th:string,zhCN:string,zhTW:string,ru:string];
const rows=`
Conversation Center|ศูนย์การสนทนา|对话中心|對話中心|Центр диалогов
Conversations|การสนทนา|对话|對話|Диалоги
AF AI Assistant|AF AI ผู้ช่วย|AF AI 助手|AF AI 助理|AF AI помощник
Customer Support|ฝ่ายบริการลูกค้า|客户支持|客戶支援|Поддержка клиентов
Delivery Assistant|ผู้ช่วยด้านการจัดส่ง|配送助手|配送助理|Помощник по доставке
Feedback Assistant|ผู้ช่วยรับความคิดเห็น|反馈助手|意見助理|Помощник по отзывам
Wholesale Assistant|ผู้ช่วยด้านค้าส่ง|批发助手|批發助理|Помощник по опту
Choose the right place to start|เลือกช่องทางที่เหมาะกับคุณ|选择合适的对话入口|選擇合適的對話入口|Выберите подходящий раздел
Ask a question|ถามคำถาม|咨询问题|諮詢問題|Задать вопрос
Track delivery|ติดตามการจัดส่ง|查询配送|查詢配送|Отследить доставку
Talk to staff|คุยกับเจ้าหน้าที่|联系人工客服|聯絡人工客服|Связаться с сотрудником
Ask, track, share or talk with us.|สอบถาม ติดตาม แสดงความคิดเห็น หรือคุยกับเรา|咨询、查配送、提反馈或联系我们|諮詢、查配送、提意見或聯絡我們|Задайте вопрос, отследите заказ или напишите нам.
All conversations|การสนทนาทั้งหมด|全部对话|全部對話|Все диалоги
Help & information|ความช่วยเหลือและข้อมูล|帮助与信息|協助與資訊|Помощь и информация
Business & feedback|ธุรกิจและข้อเสนอแนะ|商务与反馈|商務與意見|Бизнес и отзывы
Products, stores and general questions|สินค้า ร้านค้า และคำถามทั่วไป|产品、门店和常见问题|產品、門市和常見問題|Товары, магазины и общие вопросы
Talk with the ALIEN FARMERS team|พูดคุยกับทีม ALIEN FARMERS|联系 ALIEN FARMERS 客服团队|聯絡 ALIEN FARMERS 客服團隊|Связаться с командой ALIEN FARMERS
Order status, ETA and delivery help|สถานะคำสั่งซื้อ ETA และการจัดส่ง|订单状态、预计送达和配送帮助|訂單狀態、預計送達和配送協助|Статус заказа, ETA и доставка
Feedback shared privately with management|ส่งความคิดเห็นถึงฝ่ายบริหารแบบส่วนตัว|向管理层私下提交反馈|向管理層私下提交意見|Личный отзыв для руководства
Wholesale and business inquiries|ค้าส่งและคำถามทางธุรกิจ|批发及商务咨询|批發及商務諮詢|Оптовые и деловые запросы
Automated assistant|ผู้ช่วยอัตโนมัติ|自动助手|自動助理|Автоматический помощник
Staff online|เจ้าหน้าที่ออนไลน์|客服在线|客服在線|Сотрудник онлайн
Staff offline|เจ้าหน้าที่ออฟไลน์|客服离线|客服離線|Сотрудник не в сети
Waiting for staff|กำลังรอเจ้าหน้าที่|等待客服|等待客服|Ожидание сотрудника
Mock tracking|การติดตามตัวอย่าง|模拟物流查询|模擬物流查詢|Демо-отслеживание
Management only|เฉพาะฝ่ายบริหาร|仅管理层可见|僅管理層可見|Только руководство
Management|ฝ่ายบริหาร|管理层|管理層|Руководство
Search Inbox|ค้นหากล่องข้อความ|搜索收件箱|搜尋收件匣|Поиск во входящих
Search customer names and conversation messages.|ค้นหาชื่อลูกค้าและข้อความในการสนทนา|按用户名或聊天记录内容搜索。|按使用者名稱或聊天記錄內容搜尋。|Ищите по имени клиента и тексту сообщений.
Type a name or keyword…|พิมพ์ชื่อหรือคำค้น…|输入用户名或关键词…|輸入使用者名稱或關鍵詞…|Введите имя или ключевое слово…
Start typing to search the local Inbox.|เริ่มพิมพ์เพื่อค้นหาในกล่องข้อความตัวอย่าง|输入内容以搜索本地收件箱。|輸入內容以搜尋本機收件匣。|Начните ввод для поиска в локальных входящих.
No matching customers or messages.|ไม่พบลูกค้าหรือข้อความที่ตรงกัน|没有匹配的用户或聊天记录。|沒有符合的使用者或聊天記錄。|Клиенты и сообщения не найдены.
Open customer conversation|เปิดการสนทนาของลูกค้า|打开用户对话|開啟使用者對話|Открыть диалог клиента
Expand conversation list|ขยายรายการสนทนา|展开对话列表|展開對話列表|Расширить список диалогов
Collapse conversation list|ย่อรายการสนทนา|收起对话列表|收起對話列表|Свернуть список диалогов
Starred conversations|การสนทนาที่ติดดาว|星标对话|星標對話|Избранные диалоги
Mark conversation with a star|ติดดาวการสนทนา|标记为星标对话|標記為星標對話|Добавить диалог в избранное
Remove star|นำดาวออก|取消星标|取消星標|Убрать из избранного
Inquiry guide|แบบฟอร์มสอบถาม|询价引导|詢價引導|Мастер запроса
Online|ออนไลน์|在线|在線|Онлайн
Offline|ออฟไลน์|离线|離線|Не в сети
Private channel · Visible to management only|ช่องทางส่วนตัว · เฉพาะฝ่ายบริหารเท่านั้น|私密频道 · 仅管理层可见|私密頻道 · 僅管理層可見|Личный канал · Только для руководства
Local preview|ตัวอย่างในเครื่อง|本地预览|本機預覽|Локальное демо
Test data|ข้อมูลทดสอบ|测试数据|測試資料|Тестовые данные
Support preview|ตัวอย่างฝ่ายบริการ|客服预览|客服預覽|Демо поддержки
Support workspace|พื้นที่ทำงานฝ่ายบริการ|客服工作区|客服工作區|Рабочая область поддержки
Reset Demo Data|รีเซ็ตข้อมูลตัวอย่าง|重置演示数据|重設示範資料|Сбросить демо-данные
Stored on this device|จัดเก็บในอุปกรณ์นี้|保存在此设备|儲存在此裝置|Хранится на этом устройстве
Saved in Conversation Center|บันทึกในศูนย์การสนทนาแล้ว|已保存到客服中心|已儲存到客服中心|Сохранено в центре обращений
Retry|ลองอีกครั้ง|重试|重試|Повторить
No messages yet|ยังไม่มีข้อความ|暂无消息|暫無訊息|Сообщений пока нет
Back to conversations|กลับไปยังการสนทนา|返回对话列表|返回對話列表|Назад к диалогам
Simulate offline|จำลองออฟไลน์|模拟离线|模擬離線|Включить офлайн
Simulate online|จำลองออนไลน์|模拟在线|模擬在線|Включить онлайн
Message|ข้อความ|消息|訊息|Сообщение
Write a message…|เขียนข้อความ…|输入消息…|輸入訊息…|Введите сообщение…
Send message|ส่งข้อความ|发送消息|傳送訊息|Отправить
Enter to send · Shift + Enter for a new line|Enter เพื่อส่ง · Shift + Enter เพื่อขึ้นบรรทัดใหม่|Enter 发送 · Shift + Enter 换行|Enter 傳送 · Shift + Enter 換行|Enter — отправить · Shift + Enter — новая строка
Private to management in the future inbox|เป็นส่วนตัวสำหรับฝ่ายบริหารในกล่องข้อความอนาคต|未来 Inbox 中仅管理层可见|未來 Inbox 中僅管理層可見|В будущем Inbox доступно только руководству
Mock conversation|การสนทนาตัวอย่าง|模拟对话|模擬對話|Демо-диалог
You|คุณ|你|你|Вы
Assistant|ผู้ช่วย|助手|助理|Помощник
ALIEN FARMERS Staff|เจ้าหน้าที่ ALIEN FARMERS|ALIEN FARMERS 客服|ALIEN FARMERS 客服|Сотрудник ALIEN FARMERS
Typing|กำลังพิมพ์|正在输入|正在輸入|Печатает
Product Verification|ตรวจสอบสินค้า|产品验证|產品驗證|Проверка товара
Opening Hours|เวลาทำการ|营业时间|營業時間|Часы работы
Lucky Game|Lucky Game|Lucky Game|Lucky Game|Lucky Game
Talk to Staff|คุยกับเจ้าหน้าที่|联系人工客服|聯絡人工客服|Связаться с сотрудником
Effects & profile|เอฟเฟกต์และโปรไฟล์|效果与品种特点|效果與品種特點|Эффекты и профиль
Check store availability|ตรวจสอบสินค้าที่ร้าน|查询门店供应情况|查詢門市供應情況|Проверить наличие в магазине
Ask about MAC 1|สอบถามเกี่ยวกับ MAC 1|咨询 MAC 1|諮詢 MAC 1|Спросить о MAC 1
Track My Order|ติดตามคำสั่งซื้อ|查询我的订单|查詢我的訂單|Отследить заказ
Delivery Area|พื้นที่จัดส่ง|配送范围|配送範圍|Зона доставки
Delivery Time|เวลาจัดส่ง|配送时间|配送時間|Время доставки
Delivery Fee|ค่าจัดส่ง|配送费|配送費|Стоимость доставки
Contact Support|ติดต่อฝ่ายบริการ|联系客服|聯絡客服|Связаться с поддержкой
Feedback|ความคิดเห็น|反馈|意見|Отзыв
Complaint|ร้องเรียน|投诉|投訴|Жалоба
Suggestion|ข้อเสนอแนะ|建议|建議|Предложение
Staff Feedback|ความคิดเห็นต่อเจ้าหน้าที่|员工反馈|員工意見|Отзыв о сотруднике
Store Experience|ประสบการณ์ในร้าน|门店体验|門市體驗|Впечатления от магазина
Product Feedback|ความคิดเห็นต่อสินค้า|产品反馈|產品意見|Отзыв о товаре
Private Message to Management|ข้อความส่วนตัวถึงฝ่ายบริหาร|给管理层的私信|給管理層的私訊|Личное сообщение руководству
Flower Wholesale|ดอกไม้ขายส่ง|花材批发|花材批發|Цветы оптом
Rolling Papers|กระดาษมวน|卷纸|捲紙|Бумага для самокруток
Pre-Roll Cones|โคนสำเร็จรูป|预卷锥|預捲錐|Готовые конусы
Accessories|อุปกรณ์เสริม|配件|配件|Аксессуары
Partnership|พันธมิตร|合作|合作|Партнёрство
Other Inquiry|คำถามอื่น|其他咨询|其他諮詢|Другой запрос
Order Help|ช่วยเหลือเรื่องคำสั่งซื้อ|订单帮助|訂單協助|Помощь с заказом
Product Question|คำถามเกี่ยวกับสินค้า|产品问题|產品問題|Вопрос о товаре
Store Question|คำถามเกี่ยวกับร้าน|门店问题|門市問題|Вопрос о магазине
Under 100|ต่ำกว่า 100|少于 100|少於 100|Менее 100
100–500|100–500|100–500|100–500|100–500
500+|มากกว่า 500|500 以上|500 以上|Более 500
Submit Inquiry|ส่งคำถาม|提交询价|提交詢價|Отправить запрос
Start Over|เริ่มใหม่|重新填写|重新填寫|Начать заново
Start Another Inquiry|เริ่มคำถามใหม่|开始新的询价|開始新的詢價|Новый запрос
Hi — I’m the AF AI Assistant. Ask me about product verification, store information, opening hours, Lucky Game, products or navigating the website.|สวัสดี ฉันคือ AF AI Assistant ถามเรื่องการตรวจสอบสินค้า ร้านค้า เวลาทำการ Lucky Game สินค้า หรือการใช้งานเว็บไซต์ได้เลย|你好，我是 AF AI Assistant。你可以询问产品验证、门店信息、营业时间、Lucky Game、基础产品信息或网站导航。|你好，我是 AF AI Assistant。你可以詢問產品驗證、門市資訊、營業時間、Lucky Game、基礎產品資訊或網站導覽。|Здравствуйте! Я AF AI Assistant. Спросите о проверке товара, магазинах, часах работы, Lucky Game, товарах или навигации по сайту.
Customer Support conversation started|เริ่มการสนทนากับฝ่ายบริการลูกค้าแล้ว|客户支持对话已开始|客戶支援對話已開始|Диалог с поддержкой начат
Hello! Send us a message and a member of the team will reply here.|สวัสดี ส่งข้อความถึงเรา แล้วเจ้าหน้าที่จะตอบที่นี่|你好！请发送消息，客服人员会在这里回复。|你好！請傳送訊息，客服人員會在這裡回覆。|Здравствуйте! Напишите нам, и сотрудник ответит здесь.
Need help with a delivery? I can help you check order status, ETA and delivery information.|ต้องการความช่วยเหลือเรื่องการจัดส่งใช่ไหม ฉันช่วยตรวจสอบสถานะ ETA และข้อมูลการจัดส่งได้|需要配送帮助吗？我可以协助查询订单状态、预计送达时间和配送信息。|需要配送協助嗎？我可以協助查詢訂單狀態、預計送達時間和配送資訊。|Нужна помощь с доставкой? Я помогу проверить статус, ETA и детали доставки.
Your feedback helps us improve. Choose a topic or write your message in your own words.|ความคิดเห็นของคุณช่วยให้เราพัฒนาขึ้น เลือกหัวข้อหรือเขียนข้อความได้เลย|你的反馈能帮助我们改进。请选择主题，或直接写下想说的内容。|你的意見能幫助我們改進。請選擇主題，或直接寫下想說的內容。|Ваш отзыв помогает нам стать лучше. Выберите тему или напишите сообщение.
Looking for wholesale or business cooperation? Tell us what you need.|กำลังมองหาสินค้าขายส่งหรือความร่วมมือทางธุรกิจอยู่ใช่ไหม บอกเราได้เลย|正在寻找批发产品或商务合作？请告诉我们你的需求。|正在尋找批發產品或商務合作？請告訴我們你的需求。|Ищете оптовые поставки или сотрудничество? Расскажите, что вам нужно.
I’m not sure about this one. I can connect you with our support team.|ฉันยังไม่แน่ใจเกี่ยวกับคำถามนี้ ฉันสามารถเชื่อมต่อคุณกับทีมบริการได้|这个问题我暂时无法确定，可以为你转接客服团队。|這個問題我暫時無法確定，可以為你轉接客服團隊。|Я не уверен в ответе. Могу подключить нашу поддержку.
Open Delivery Assistant|เปิดผู้ช่วยจัดส่ง|打开配送助手|開啟配送助理|Открыть помощника по доставке
Open Wholesale Assistant|เปิดผู้ช่วยขายส่ง|打开批发助手|開啟批發助理|Открыть помощника по опту
Approximately how many units are you looking for?|ต้องการประมาณกี่ชิ้น|预计需要多少数量？|預計需要多少數量？|Какое количество вам нужно?
Where should the order be supplied? City and country are enough for this demo.|ต้องการจัดส่งไปที่ใด ระบุเมืองและประเทศก็เพียงพอสำหรับตัวอย่างนี้|需要供应到哪里？本演示只需填写城市和国家。|需要供應到哪裡？本示範只需填寫城市和國家。|Куда нужна поставка? Для демо достаточно города и страны.
How should our wholesale team contact you? Enter an email address, phone number or preferred contact method. This stays on this device.|ต้องการให้ทีมค้าส่งติดต่ออย่างไร ข้อมูลนี้จะอยู่ในอุปกรณ์นี้เท่านั้น|批发团队应如何联系你？可填写邮箱、电话或偏好方式；信息只保存在此设备。|批發團隊應如何聯絡你？可填寫電郵、電話或偏好方式；資訊只儲存在此裝置。|Как с вами связаться? Укажите способ связи; данные останутся на этом устройстве.
Your inquiry is saved in this browser demo. No information has been submitted to ALIEN FARMERS yet.|คำถามถูกบันทึกในเบราว์เซอร์ตัวอย่างและยังไม่ได้ส่งไปยัง ALIEN FARMERS|询价已保存在浏览器演示中，尚未提交给 ALIEN FARMERS。|詢價已儲存在瀏覽器示範中，尚未提交給 ALIEN FARMERS。|Запрос сохранён в демо браузера и ещё не отправлен ALIEN FARMERS.
Thank you. Your message is saved privately in this browser demo for management review. Nothing has been submitted to a server.|ขอบคุณ ข้อความถูกเก็บแบบส่วนตัวในเบราว์เซอร์และยังไม่ได้ส่งไปยังเซิร์ฟเวอร์|谢谢。消息已私密保存在此浏览器中供管理层演示查看，尚未提交到服务器。|謝謝。訊息已私密儲存在此瀏覽器中供管理層示範查看，尚未提交到伺服器。|Спасибо. Сообщение сохранено локально для демо руководства и не отправлено на сервер.
Please describe what happened or what you would like us to know.|โปรดเล่าสิ่งที่เกิดขึ้นหรือสิ่งที่ต้องการแจ้งให้เราทราบ|请描述发生了什么，或希望我们了解的内容。|請描述發生了什麼，或希望我們了解的內容。|Опишите, что произошло или что вы хотите сообщить.
What are you interested in?|สนใจสินค้าอะไร|你对什么产品感兴趣？|你對什麼產品感興趣？|Что вас интересует?
Opening conversations…|กำลังเปิดการสนทนา…|正在打开对话…|正在開啟對話…|Открываем диалоги…
Operations|ฝ่ายปฏิบัติการ|运营后台|營運後台|Операции
Automation & Knowledge|ระบบตอบอัตโนมัติและความรู้|自动回复与知识库|自動回覆與知識庫|Автоответы и база знаний
Unified Inbox|กล่องข้อความรวม|统一收件箱|統一收件匣|Единый Inbox
Customer conversations by channel|การสนทนาของลูกค้าแยกตามช่องทาง|按频道查看用户对话|按頻道查看用戶對話|Диалоги клиентов по каналам
Visible conversations|การสนทนาที่มองเห็น|可见对话|可見對話|Доступные диалоги
Local Preview Visitor|ผู้เยี่ยมชมตัวอย่าง|本地预览用户|本機預覽用戶|Локальный демо-клиент
via|ผ่าน|来自|來自|через
Customer|ลูกค้า|用户|用戶|Клиент
Automated reply|การตอบกลับอัตโนมัติ|自动回复|自動回覆|Автоответ
Reply to customer…|ตอบลูกค้า…|回复用户…|回覆用戶…|Ответить клиенту…
Send reply to customer|ส่งคำตอบให้ลูกค้า|发送给用户|傳送給用戶|Отправить ответ клиенту
Customer conversation|การสนทนากับลูกค้า|用户对话|用戶對話|Диалог с клиентом
Entered through|เข้าผ่าน|进入入口|進入入口|Вход через
Assistant messages are automation in this customer thread.|ข้อความจากผู้ช่วยคือระบบอัตโนมัติในการสนทนากับลูกค้านี้|助手消息是该用户对话中的自动回复。|助理訊息是該用戶對話中的自動回覆。|Сообщения помощника — это автоматизация в диалоге с клиентом.
Manage assistant channels and routing|จัดการช่องทางผู้ช่วยและการส่งต่อ|管理助手频道与分流|管理助理頻道與分流|Управление каналами и маршрутизацией
Role preview|ตัวอย่างบทบาท|角色预览|角色預覽|Просмотр роли
Owner|เจ้าของ|Owner|Owner|Владелец
Admin|ผู้ดูแลระบบ|Admin|Admin|Администратор
Staff|เจ้าหน้าที่|Staff|Staff|Сотрудник
All Channels|ทุกช่องทาง|全部频道|全部頻道|Все каналы
All|ทั้งหมด|全部|全部|Все
Active|กำลังใช้งาน|进行中|進行中|Активные
Closed|ปิดแล้ว|已关闭|已關閉|Закрытые
Conversation status|สถานะการสนทนา|对话状态|對話狀態|Статус диалога
Settings|การตั้งค่า|设置|設定|Настройки
Turn motion on|เปิดเอฟเฟกต์การเคลื่อนไหว|开启动态效果|開啟動態效果|Включить анимацию
Turn motion off|ปิดเอฟเฟกต์การเคลื่อนไหว|关闭动态效果|關閉動態效果|Выключить анимацию
Light mode|โหมดสว่าง|浅色模式|淺色模式|Светлая тема
Dark mode|โหมดมืด|深色模式|深色模式|Тёмная тема
New message|ข้อความใหม่|新消息|新訊息|Новое сообщение
Unread message|ข้อความยังไม่อ่าน|条未读消息|則未讀訊息|непрочитанное сообщение
Unread messages|ข้อความยังไม่อ่าน|条未读消息|則未讀訊息|непрочитанных сообщений
Keep your conversations connected|เก็บการสนทนาของคุณให้เชื่อมต่อกัน|让对话与账号保持连接|讓對話與帳號保持連結|Сохраняйте связь с диалогами
Choose how you want to enter the Conversation Center.|เลือกวิธีเข้าสู่ศูนย์การสนทนา|请选择进入对话中心的方式。|請選擇進入對話中心的方式。|Выберите способ входа в центр диалогов.
Member access|สิทธิ์สมาชิก|会员模式|會員模式|Доступ участника
Connect orders and member details, unlock every assistant and enable secure account conversations.|เชื่อมต่อคำสั่งซื้อและข้อมูลสมาชิก ปลดล็อกผู้ช่วยทั้งหมด และเปิดใช้การสนทนาในบัญชีที่ปลอดภัย|关联订单和会员资料，解锁全部助手并启用安全的账号对话。|關聯訂單和會員資料，解鎖全部助理並啟用安全的帳號對話。|Свяжите заказы и данные участника, откройте всех помощников и безопасные диалоги аккаунта.
Optional cloud history|ประวัติบนคลาวด์แบบเลือกได้|可选云端记录|可選雲端記錄|Облачная история по выбору
When the real account service is connected, members can choose to keep chat history for up to 1 year.|เมื่อเชื่อมต่อระบบบัญชีจริง สมาชิกจะเลือกเก็บประวัติแชทบนคลาวด์ได้นานสูงสุด 1 ปี|正式接入账号服务后，会员可选择在云端保存最长 1 年的聊天记录。|正式接入帳號服務後，會員可選擇在雲端保存最長 1 年的聊天記錄。|После подключения аккаунтов участники смогут хранить историю в облаке до 1 года.
Anonymous mode keeps messages only in this browser. Clearing site data or changing devices can remove them, and only AI Assistant and Customer Support are available.|โหมดไม่ระบุตัวตนเก็บข้อความไว้เฉพาะในเบราว์เซอร์นี้ การล้างข้อมูลหรือเปลี่ยนอุปกรณ์อาจทำให้ข้อความหาย และใช้ได้เฉพาะ AI Assistant กับ Customer Support|匿名模式仅将消息保存在当前浏览器；清除网站数据或更换设备可能导致记录丢失，且仅可使用 AI 助手和客户支持。|匿名模式僅將訊息保存在目前瀏覽器；清除網站資料或更換裝置可能導致記錄遺失，且僅可使用 AI 助理和客戶支援。|В анонимном режиме сообщения хранятся только в этом браузере и могут исчезнуть после очистки данных или смены устройства; доступны только AI Assistant и Customer Support.
Continue anonymously|ใช้งานต่อแบบไม่ระบุตัวตน|继续匿名使用|繼續匿名使用|Продолжить анонимно
Log in or register|เข้าสู่ระบบหรือสมัครสมาชิก|立即登录或注册|立即登入或註冊|Войти или зарегистрироваться
Local preview · No real account, encryption or cloud storage is connected yet.|ตัวอย่างในเครื่อง · ยังไม่ได้เชื่อมต่อบัญชีจริง การเข้ารหัส หรือพื้นที่เก็บข้อมูลคลาวด์|本地预览 · 暂未连接真实账号、加密服务或云端存储。|本機預覽 · 暫未連接真實帳號、加密服務或雲端儲存。|Локальное демо · Реальные аккаунты, шифрование и облако пока не подключены.
Test environment · No real account, encryption or cloud storage is connected yet.|สภาพแวดล้อมทดสอบ · ยังไม่ได้เชื่อมต่อบัญชีจริง การเข้ารหัส หรือพื้นที่เก็บข้อมูลคลาวด์|测试环境 · 暂未连接真实账号、加密服务或云端存储。|測試環境 · 暫未連接真實帳號、加密服務或雲端儲存。|Тестовая среда · Реальные аккаунты, шифрование и облако пока не подключены.
Local preview · Real member accounts are connected; conversations and cloud history remain test-only.|ตัวอย่างในเครื่อง · เชื่อมต่อบัญชีสมาชิกจริงแล้ว แต่การสนทนาและประวัติบนคลาวด์ยังเป็นข้อมูลทดสอบ|本地预览 · 已连接真实会员账号；对话和云端历史仍仅供测试。|本機預覽 · 已連接真實會員帳戶；對話和雲端歷史仍僅供測試。|Локальное демо · Реальные аккаунты подключены; диалоги и облачная история остаются тестовыми.
Test environment · Real member accounts are connected; conversations and cloud history remain test-only.|สภาพแวดล้อมทดสอบ · เชื่อมต่อบัญชีสมาชิกจริงแล้ว แต่การสนทนาและประวัติบนคลาวด์ยังเป็นข้อมูลทดสอบ|测试环境 · 已连接真实会员账号；对话和云端历史仍仅供测试。|測試環境 · 已連接真實會員帳戶；對話和雲端歷史仍僅供測試。|Тестовая среда · Реальные аккаунты подключены; диалоги и облачная история остаются тестовыми.
Sign in to unlock this conversation|เข้าสู่ระบบเพื่อปลดล็อกการสนทนานี้|登录会员以解锁此对话|登入會員以解鎖此對話|Войдите, чтобы открыть этот диалог
Member preview|ตัวอย่างสมาชิก|会员预览|會員預覽|Демо участника
Anonymous|ไม่ระบุตัวตน|匿名模式|匿名模式|Анонимно
Management channels hidden|ซ่อนช่องทางสำหรับฝ่ายบริหาร|已隐藏管理层频道|已隱藏管理層頻道|Каналы руководства скрыты
No conversations match these filters.|ไม่มีการสนทนาที่ตรงกับตัวกรอง|没有符合当前筛选条件的对话。|沒有符合目前篩選條件的對話。|Нет диалогов по этим фильтрам.
Waiting|กำลังรอ|等待处理|等待處理|Ожидают
Private|ส่วนตัว|私密|私密|Личные
No conversations available for this role.|ไม่มีการสนทนาสำหรับบทบาทนี้|此角色没有可查看的对话。|此角色沒有可查看的對話。|Для этой роли нет доступных диалогов.
Conversation details|รายละเอียดการสนทนา|会话详情|對話詳情|Детали диалога
Channel|ช่องทาง|频道|頻道|Канал
Status|สถานะ|状态|狀態|Статус
Human support|ฝ่ายบริการลูกค้า|人工客服|人工客服|Поддержка
Delivery|การจัดส่ง|配送|配送|Доставка
Private feedback|ความคิดเห็นส่วนตัว|私密反馈|私密意見|Личный отзыв
Wholesale|ค้าส่ง|批发|批發|Опт
Access|การเข้าถึง|访问权限|存取權限|Доступ
Routing|การส่งต่อ|分流方式|分流方式|Маршрутизация
Owner and Admin only|เฉพาะเจ้าของและผู้ดูแลระบบ|仅 Owner 和 Admin|僅 Owner 和 Admin|Только Owner и Admin
All support roles|ทุกบทบาทฝ่ายบริการ|所有客服角色|所有客服角色|Все роли поддержки
Automated workflow|เวิร์กโฟลว์อัตโนมัติ|自动化流程|自動化流程|Автоматический сценарий
Human support queue|คิวฝ่ายบริการลูกค้า|人工客服队列|人工客服佇列|Очередь поддержки
Future server policy required|ต้องใช้นโยบายเซิร์ฟเวอร์ในอนาคต|未来必须由服务端权限保护|未來必須由伺服器權限保護|В будущем нужна серверная политика
This role cannot view private feedback conversations.|บทบาทนี้ไม่สามารถดูความคิดเห็นส่วนตัวได้|此角色不能查看私密反馈会话。|此角色不能查看私密意見對話。|Эта роль не видит личные отзывы.
Close conversation|ปิดการสนทนา|关闭会话|關閉對話|Закрыть диалог
Reopen conversation|เปิดการสนทนาอีกครั้ง|重新打开会话|重新開啟對話|Открыть диалог снова
Closed|ปิดแล้ว|已关闭|已關閉|Закрыт
Active|ใช้งานอยู่|进行中|進行中|Активен
Reply as staff…|ตอบในฐานะเจ้าหน้าที่…|以客服身份回复…|以客服身份回覆…|Ответить как сотрудник…
Send staff reply|ส่งคำตอบเจ้าหน้าที่|发送客服回复|傳送客服回覆|Отправить ответ
Open customer view|เปิดมุมมองลูกค้า|打开用户端|開啟使用者端|Открыть клиентский вид
For help with this question, please contact Customer Support.|หากต้องการความช่วยเหลือเกี่ยวกับคำถามนี้ โปรดติดต่อฝ่ายบริการลูกค้า|如需此问题的帮助，请联系客户支持。|如需此問題的協助，請聯絡客戶支援。|Обратитесь в службу поддержки по этому вопросу.
For delivery help, contact Customer Support and include your order number.|หากต้องการความช่วยเหลือด้านการจัดส่ง โปรดติดต่อฝ่ายบริการลูกค้าและแจ้งหมายเลขคำสั่งซื้อ|如需配送帮助，请联系客户支持并提供订单号。|如需配送協助，請聯絡客戶支援並提供訂單號碼。|По вопросам доставки обратитесь в поддержку и укажите номер заказа.
Opening hours can vary by location. Please check the selected store before visiting.|เวลาทำการอาจแตกต่างกันในแต่ละสาขา โปรดตรวจสอบสาขาที่เลือกก่อนเดินทาง|各门店营业时间可能不同，请在到店前确认所选门店。|各門市營業時間可能不同，請在到店前確認所選門市。|Часы работы зависят от магазина. Проверьте выбранный магазин перед визитом.
Lucky Game information is available on the ALIEN FARMERS website.|ดูข้อมูล Lucky Game ได้บนเว็บไซต์ ALIEN FARMERS|Lucky Game 信息可在 ALIEN FARMERS 网站查看。|Lucky Game 資訊可在 ALIEN FARMERS 網站查看。|Информация о Lucky Game доступна на сайте ALIEN FARMERS.
For wholesale and business inquiries, please contact Customer Support.|สำหรับคำถามด้านค้าส่งและธุรกิจ โปรดติดต่อฝ่ายบริการลูกค้า|批发及商务咨询请联系客户支持。|批發及商務諮詢請聯絡客戶支援。|По вопросам опта и сотрудничества обратитесь в службу поддержки.
Your message is waiting for Customer Support.|ข้อความของคุณกำลังรอฝ่ายบริการลูกค้า|你的消息正在等待客户支持处理。|你的訊息正在等待客戶支援處理。|Ваше сообщение ожидает ответа службы поддержки.
Customer Support is currently offline. Your message remains on this device.|ขณะนี้ฝ่ายบริการลูกค้าออฟไลน์ ข้อความของคุณยังคงอยู่ในอุปกรณ์นี้|客户支持当前离线，你的消息仍保存在此设备上。|客戶支援目前離線，你的訊息仍儲存在此裝置上。|Служба поддержки сейчас не в сети. Сообщение осталось на этом устройстве.
Delivery tracking is not available in this chat yet. Please contact Customer Support and include your order number.|ยังไม่สามารถติดตามการจัดส่งในแชตนี้ได้ โปรดติดต่อฝ่ายบริการลูกค้าและแจ้งหมายเลขคำสั่งซื้อ|此聊天暂不支持配送查询，请联系客户支持并提供订单号。|此聊天暫不支援配送查詢，請聯絡客戶支援並提供訂單號碼。|Отслеживание доставки пока недоступно в этом чате. Обратитесь в поддержку и укажите номер заказа.
Private feedback delivery is not available in this chat yet.|แชตนี้ยังไม่รองรับการส่งความคิดเห็นส่วนตัว|此聊天暂不支持提交私密反馈。|此聊天暫不支援提交私密意見。|Отправка личных отзывов пока недоступна в этом чате.
Wholesale inquiry delivery is not available in this chat yet. Please contact Customer Support.|ยังไม่สามารถส่งคำถามด้านค้าส่งในแชตนี้ได้ โปรดติดต่อฝ่ายบริการลูกค้า|此聊天暂不支持提交批发咨询，请联系客户支持。|此聊天暫不支援提交批發諮詢，請聯絡客戶支援。|Отправка оптовых запросов пока недоступна в этом чате. Обратитесь в поддержку.
Visible assistants|ผู้ช่วยที่มองเห็น|可见助手|可見助理|Доступные помощники
Private feedback hidden|ซ่อนความคิดเห็นส่วนตัว|私密反馈已隐藏|私密意見已隱藏|Личные отзывы скрыты
Open Product Verification from the ALIEN FARMERS website and enter or scan the verification code on your product. Never share a code publicly.|เปิดการตรวจสอบสินค้าจากเว็บไซต์ ALIEN FARMERS แล้วกรอกหรือสแกนรหัสสินค้า อย่าเผยแพร่รหัสต่อสาธารณะ|请从 ALIEN FARMERS 网站打开“产品验证”，输入或扫描产品验证码。请勿公开分享验证码。|請從 ALIEN FARMERS 網站開啟「產品驗證」，輸入或掃描產品驗證碼。請勿公開分享驗證碼。|Откройте проверку товара на сайте ALIEN FARMERS и введите или отсканируйте код. Не публикуйте его.
For delivery help, the Delivery Assistant can guide you through mock tracking, ETA, areas and fees.|ผู้ช่วยจัดส่งสามารถแนะนำการติดตาม ETA พื้นที่และค่าจัดส่งแบบตัวอย่างได้|配送助手可以提供模拟物流、预计送达、配送范围和费用信息。|配送助理可以提供模擬物流、預計送達、配送範圍和費用資訊。|Помощник по доставке покажет демо-трекинг, ETA, зоны и стоимость.
Store details and directions are available from the Store Information section of the ALIEN FARMERS website.|ดูรายละเอียดและเส้นทางร้านค้าได้ในส่วนข้อมูลร้านค้าบนเว็บไซต์ ALIEN FARMERS|可在 ALIEN FARMERS 网站的“门店信息”中查看门店详情和路线。|可在 ALIEN FARMERS 網站的「門市資訊」中查看門市詳情和路線。|Адреса и маршруты доступны в разделе информации о магазинах на сайте.
Opening hours can vary by location. In this demo, please choose a store before relying on the displayed hours.|เวลาทำการอาจแตกต่างกัน กรุณาเลือกร้านก่อนดูเวลาในตัวอย่าง|各门店营业时间可能不同，请先选择门店再查看演示时间。|各門市營業時間可能不同，請先選擇門市再查看示範時間。|Часы работы зависят от магазина. Сначала выберите магазин.
Lucky Game information is available on the website. Eligibility and rewards shown in this preview are examples only.|ดูข้อมูล Lucky Game ได้บนเว็บไซต์ สิทธิ์และรางวัลในตัวอย่างเป็นข้อมูลจำลอง|Lucky Game 信息可在网站查看；本预览中的资格与奖励仅为示例。|Lucky Game 資訊可在網站查看；本預覽中的資格與獎勵僅為示例。|Информация Lucky Game доступна на сайте; условия и награды в демо условны.
The Wholesale Assistant can collect product, quantity, location and contact details for a business inquiry.|ผู้ช่วยขายส่งจะรวบรวมสินค้า จำนวน สถานที่ และข้อมูลติดต่อสำหรับคำถามทางธุรกิจ|批发助手可以引导收集产品、数量、地点和联系方式。|批發助理可以引導收集產品、數量、地點和聯絡方式。|Помощник по опту соберёт товар, количество, регион и контакты.
I can connect you with Customer Support.|ฉันสามารถเชื่อมต่อคุณกับฝ่ายบริการลูกค้าได้|我可以为你转接 Customer Support。|我可以為你轉接 Customer Support。|Я могу подключить Customer Support.
Thanks — a staff member has received your message. This reply is simulated for the local preview.|ขอบคุณ เจ้าหน้าที่ได้รับข้อความแล้ว การตอบกลับนี้เป็นการจำลองในเครื่อง|谢谢，客服已收到你的消息。这是本地预览中的模拟回复。|謝謝，客服已收到你的訊息。這是本機預覽中的模擬回覆。|Спасибо, сотрудник получил сообщение. Это локальный демо-ответ.
Our staff are offline right now. Your message is saved on this device and marked as waiting.|ขณะนี้เจ้าหน้าที่ออฟไลน์ ข้อความถูกบันทึกในอุปกรณ์นี้และทำเครื่องหมายว่ารออยู่|客服当前离线。消息已保存在此设备，并标记为等待处理。|客服目前離線。訊息已儲存在此裝置，並標記為等待處理。|Сотрудники не в сети. Сообщение сохранено на устройстве и ожидает ответа.
I found two mock orders. Choose one to preview its delivery status.|พบคำสั่งซื้อตัวอย่าง 2 รายการ เลือกหนึ่งรายการเพื่อดูสถานะ|找到两笔模拟订单，请选择一笔查看配送状态。|找到兩筆模擬訂單，請選擇一筆查看配送狀態。|Найдено два демо-заказа. Выберите заказ для просмотра статуса.
AF-PREVIEW-1042 is preparing. Mock ETA: September 9–10. Courier has not been assigned yet.|AF-PREVIEW-1042 กำลังเตรียม ETA ตัวอย่าง 9–10 กันยายน ยังไม่ได้กำหนดผู้จัดส่ง|AF-PREVIEW-1042 正在备货。模拟预计送达：9 月 9–10 日；尚未分配配送员。|AF-PREVIEW-1042 正在備貨。模擬預計送達：9 月 9–10 日；尚未分配配送員。|AF-PREVIEW-1042 готовится. Демо ETA: 9–10 сентября. Курьер ещё не назначен.
AF-PREVIEW-0987 was handed to the courier. Mock ETA: today before 18:00.|AF-PREVIEW-0987 ส่งให้ผู้จัดส่งแล้ว ETA ตัวอย่างวันนี้ก่อน 18:00|AF-PREVIEW-0987 已交给配送员。模拟预计送达：今天 18:00 前。|AF-PREVIEW-0987 已交給配送員。模擬預計送達：今天 18:00 前。|AF-PREVIEW-0987 передан курьеру. Демо ETA: сегодня до 18:00.
Choose a delivery topic and I’ll show the available mock information.|เลือกหัวข้อการจัดส่งเพื่อดูข้อมูลตัวอย่าง|请选择配送主题，我会显示相应的模拟信息。|請選擇配送主題，我會顯示相應的模擬資訊。|Выберите тему доставки, и я покажу демо-информацию.
This demo shows delivery coverage for central Bangkok. Entering a real address is not required.|ตัวอย่างนี้แสดงพื้นที่จัดส่งในกรุงเทพชั้นใน ไม่ต้องใส่ที่อยู่จริง|本演示的配送范围为曼谷市中心，无需输入真实地址。|本示範的配送範圍為曼谷市中心，無需輸入真實地址。|Демо показывает доставку в центре Бангкока. Реальный адрес не нужен.
Mock delivery windows are 10:00–14:00 and 14:00–18:00.|ช่วงเวลาจัดส่งตัวอย่างคือ 10:00–14:00 และ 14:00–18:00|模拟配送时段为 10:00–14:00 和 14:00–18:00。|模擬配送時段為 10:00–14:00 和 14:00–18:00。|Демо-окна доставки: 10:00–14:00 и 14:00–18:00.
Mock delivery fee: ฿80, or free for eligible orders over ฿2,000.|ค่าจัดส่งตัวอย่าง 80 บาท หรือฟรีสำหรับคำสั่งซื้อที่เข้าเกณฑ์เกิน 2,000 บาท|模拟配送费：฿80；符合条件且满 ฿2,000 免费。|模擬配送費：฿80；符合條件且滿 ฿2,000 免費。|Демо-стоимость: ฿80, бесплатно для подходящих заказов от ฿2 000.
This demo inquiry is already saved on this device.|คำถามตัวอย่างนี้ถูกบันทึกในอุปกรณ์นี้แล้ว|该演示询价已保存在此设备上。|該示範詢價已儲存在此裝置上。|Демо-запрос уже сохранён на этом устройстве.
I found available products for “{name}” in the local demo catalog. What would you like to check next?|พบสินค้าสำหรับ “{name}” ในแค็ตตาล็อกตัวอย่าง คุณต้องการตรวจสอบอะไรต่อ|在本地演示目录中找到了“{name}”相关产品。你接下来想了解什么？|在本機示範目錄中找到了「{name}」相關產品。你接下來想了解什麼？|В локальном демо-каталоге найдены товары по запросу «{name}». Что проверить дальше?
I couldn’t find “{name}” in the local demo catalog. Here are some similar options:|ไม่พบ “{name}” ในแค็ตตาล็อกตัวอย่าง นี่คือตัวเลือกที่คล้ายกัน|本地演示目录中没有找到“{name}”。这里有一些相似品种：|本機示範目錄中沒有找到「{name}」。這裡有一些相似品種：|В локальном демо-каталоге нет «{name}». Вот похожие варианты:
This item is listed as available in the local demo catalog. Would you like to check store availability or ask our staff?|สินค้านี้แสดงว่ามีในแค็ตตาล็อกตัวอย่าง ต้องการตรวจสอบสินค้าที่ร้านหรือสอบถามเจ้าหน้าที่หรือไม่|本地演示目录显示该产品当前可供应。需要查询门店供应情况，还是联系人工客服？|本機示範目錄顯示該產品目前可供應。需要查詢門市供應情況，還是聯絡人工客服？|В локальном демо-каталоге товар отмечен как доступный. Проверить магазин или спросить сотрудника?
Product effects can vary by person and batch. In this local preview, you can ask about a specific item or contact staff for current product details.|เอฟเฟกต์อาจแตกต่างกันตามบุคคลและล็อตสินค้า ในตัวอย่างนี้คุณสามารถถามถึงสินค้าเฉพาะหรือสอบถามเจ้าหน้าที่|产品效果可能因人和批次而异。在本地预览中，你可以继续咨询具体产品，或联系人工客服了解当前详情。|產品效果可能因人和批次而異。在本機預覽中，你可以繼續諮詢具體產品，或聯絡人工客服了解目前詳情。|Эффекты зависят от человека и партии. В демо можно уточнить конкретный товар или обратиться к сотруднику.
Please review your inquiry:|กรุณาตรวจสอบคำถามของคุณ:|请检查询价信息：|請檢查詢價資訊：|Проверьте запрос:
Product|สินค้า|产品|產品|Товар
Quantity|จำนวน|数量|數量|Количество
Location|สถานที่|地点|地點|Место
Contact|ข้อมูลติดต่อ|联系方式|聯絡方式|Контакт
Chat with us|แชทกับเรา|与我们聊天|與我們聊天|Напишите нам
Open chat|เปิดแชท|打开聊天|開啟聊天|Открыть чат
Close chat|ปิดแชท|关闭聊天|關閉聊天|Закрыть чат
Minimize chat|ย่อหน้าต่างแชท|收起聊天|收起聊天|Свернуть чат
Open full conversation center|เปิดศูนย์การสนทนาแบบเต็ม|打开完整对话中心|開啟完整對話中心|Открыть полный центр диалогов
Opening chat…|กำลังเปิดแชท…|正在打开聊天…|正在開啟聊天…|Открываем чат…
Your conversation will appear here in a moment.|การสนทนาจะปรากฏที่นี่ในอีกสักครู่|对话即将在这里显示。|對話即將在這裡顯示。|Диалог появится здесь через мгновение.
Chat is unavailable|ไม่สามารถใช้งานแชทได้|聊天暂不可用|聊天暫不可用|Чат недоступен
Please try again or open the full conversation center.|โปรดลองอีกครั้งหรือเปิดศูนย์การสนทนาแบบเต็ม|请重试或打开完整对话中心。|請重試或開啟完整對話中心。|Повторите попытку или откройте полный центр диалогов.
Try again|ลองอีกครั้ง|重试|重試|Повторить
How can we help?|ให้เราช่วยอะไรได้บ้าง|需要什么帮助？|需要什麼協助？|Чем мы можем помочь?
Ask about products, stores, delivery, or contact Customer Support.|สอบถามสินค้า ร้านค้า การจัดส่ง หรือติดต่อฝ่ายบริการลูกค้า|可以咨询产品、门店、配送，或联系客户支持。|可以諮詢產品、門市、配送，或聯絡客戶支援。|Спросите о товарах, магазинах, доставке или свяжитесь с поддержкой.
`;
const COPY:Record<string,LocalizedCopy>=Object.fromEntries(rows.trim().split('\n').map(row=>{const [key,...values]=row.split('|');return [key,values as LocalizedCopy];}));
export function assistantText(text:string,locale:ContentLanguage){
 if(locale==='en')return text;
 const index:{[K in Exclude<ContentLanguage,'en'>]:number}={th:0,'zh-CN':1,'zh-TW':2,ru:3},translate=(key:string)=>COPY[key]?.[index[locale]]||key;
 const found=text.match(/^I found available products for “(.+)” in the local demo catalog\. What would you like to check next\?$/);if(found)return translate('I found available products for “{name}” in the local demo catalog. What would you like to check next?').replace('{name}',found[1]);
 const missing=text.match(/^I couldn’t find “(.+)” in the local demo catalog\. Here are some similar options:$/);if(missing)return translate('I couldn’t find “{name}” in the local demo catalog. Here are some similar options:').replace('{name}',missing[1]);
 if(text.startsWith('Please review your inquiry:\n\n'))return text.split('\n').map((line,lineIndex)=>{if(lineIndex===0)return translate('Please review your inquiry:');const separator=line.indexOf(':');return separator>0?`${translate(line.slice(0,separator))}:${line.slice(separator+1)}`:line;}).join('\n');
 return translate(text);
}
