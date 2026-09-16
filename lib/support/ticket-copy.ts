import type {Locale} from './i18n';
const rows=`
Customer support|บริการลูกค้า|客服支持|客服支援|Поддержка клиентов
How can we help?|ให้เราช่วยเรื่องอะไร?|有什么可以帮你？|有什麼可以幫你？|Чем мы можем помочь?
Service tickets|คำร้องบริการ|服务工单|服務工單|Обращения
Ask about a product or request after-sales help.|สอบถามสินค้าหรือขอความช่วยเหลือหลังการขาย|咨询产品，或提交订单售后申请。|諮詢產品，或提交訂單售後申請。|Задайте вопрос о товаре или обратитесь за помощью после покупки.
Live support|แชตกับเจ้าหน้าที่|在线客服|線上客服|Чат поддержки
Talk with our support team.|พูดคุยกับทีมบริการลูกค้า|与客服团队在线沟通。|與客服團隊線上溝通。|Свяжитесь с нашей службой поддержки.
About us|เกี่ยวกับเรา|关于我们|關於我們|О нас
Get to know ALIEN FARMERS.|รู้จัก ALIEN FARMERS|了解 ALIEN FARMERS。|認識 ALIEN FARMERS。|Узнайте об ALIEN FARMERS.
Back to support|กลับสู่บริการลูกค้า|返回客服支持|返回客服支援|Назад в поддержку
New ticket|คำร้องใหม่|新建工单|新增工單|Новое обращение
My tickets|คำร้องของฉัน|我的工单|我的工單|Мои обращения
Pre-sales inquiry|สอบถามก่อนซื้อ|售前咨询|售前諮詢|Вопрос до покупки
After-sales service|บริการหลังการขาย|售后服务|售後服務|Помощь после покупки
Other request|เรื่องอื่นๆ|其他咨询|其他諮詢|Другой вопрос
Request type|ประเภทคำร้อง|服务类型|服務類型|Тип обращения
Product|สินค้า|产品|產品|Товар
Flowers|ดอก|花类产品|花類產品|Цветы
Extracts|สารสกัด|提取物|萃取物|Экстракты
Search products|ค้นหาสินค้า|搜索产品|搜尋產品|Поиск товаров
Select a product|เลือกสินค้า|请选择产品|請選擇產品|Выберите товар
No matching products|ไม่พบสินค้า|未找到匹配产品|未找到符合的產品|Товары не найдены
Load more|โหลดเพิ่มเติม|加载更多|載入更多|Загрузить ещё
Order|คำสั่งซื้อ|订单|訂單|Заказ
Select an order|เลือกคำสั่งซื้อ|请选择订单|請選擇訂單|Выберите заказ
Ordered item|สินค้าในคำสั่งซื้อ|订单商品|訂單商品|Товар из заказа
Issue|ปัญหา|问题类型|問題類型|Проблема
Product information|ข้อมูลสินค้า|产品信息|產品資訊|Информация о товаре
Availability|สินค้าพร้อมจำหน่าย|库存及供货|庫存及供貨|Наличие
Delivery|การจัดส่ง|配送问题|配送問題|Доставка
Mold or quality issue|เชื้อราหรือปัญหาคุณภาพ|发霉或质量问题|發霉或品質問題|Плесень или проблема с качеством
Damaged item|สินค้าเสียหาย|商品或包装破损|商品或包裝破損|Повреждение товара
Wrong item|ได้รับสินค้าผิด|商品发错|商品寄錯|Не тот товар
Missing item|สินค้าไม่ครบ|商品缺失|商品缺少|Не хватает товара
Other|อื่นๆ|其他|其他|Другое
Preferred resolution|วิธีแก้ไขที่ต้องการ|期望解决方案|期望解決方案|Желаемое решение
Return and replace with the same product|คืนและเปลี่ยนเป็นสินค้าเดิม|退货换货：换同款完好商品|退貨換貨：換同款完好商品|Вернуть и заменить тем же товаром
Return and exchange for another product|คืนและเปลี่ยนเป็นสินค้าอื่น|退货换货：换其他品种|退貨換貨：換其他品種|Вернуть и обменять на другой товар
Return and refund|คืนสินค้าและขอคืนเงิน|退货退款|退貨退款|Вернуть товар и деньги
Describe another solution|ระบุวิธีแก้ไขอื่น|自填写解决方案|自行填寫解決方案|Предложить другое решение
Replacement product|สินค้าที่ต้องการเปลี่ยน|期望更换的产品|希望更換的產品|Товар для замены
Details|รายละเอียด|详细说明|詳細說明|Подробности
Describe your question and preferred outcome.|อธิบายคำถามและผลลัพธ์ที่ต้องการ|请描述具体问题、涉及数量及期望的处理方式。|請描述具體問題、涉及數量及希望的處理方式。|Опишите проблему, количество и желаемое решение.
Requests are reviewed by our team. Refunds and exchanges are not automatic.|ทีมงานจะตรวจสอบคำร้อง การคืนเงินและเปลี่ยนสินค้าไม่ได้เกิดขึ้นอัตโนมัติ|客服会审核申请，提交工单不会自动退款或换货。|客服會審核申請，提交工單不會自動退款或換貨。|Обращение рассмотрит наша команда. Возврат и обмен не выполняются автоматически.
Submit ticket|ส่งคำร้อง|提交工单|提交工單|Отправить обращение
Submitting…|กำลังส่ง…|正在提交…|正在提交…|Отправка…
Ticket submitted|ส่งคำร้องแล้ว|工单已提交|工單已提交|Обращение отправлено
Sign in to submit tickets and view your orders.|เข้าสู่ระบบเพื่อส่งคำร้องและดูคำสั่งซื้อ|登录后可提交工单并读取自己的订单。|登入後可提交工單並讀取自己的訂單。|Войдите, чтобы отправлять обращения и видеть свои заказы.
Sign in|เข้าสู่ระบบ|登录|登入|Войти
Loading…|กำลังโหลด…|正在加载…|正在載入…|Загрузка…
Retry|ลองอีกครั้ง|重试|重試|Повторить
Unable to load. Please retry.|โหลดไม่สำเร็จ โปรดลองอีกครั้ง|加载失败，请重试。|載入失敗，請重試。|Не удалось загрузить. Повторите попытку.
Unable to submit. Your details are kept; please retry.|ส่งไม่สำเร็จ เก็บข้อมูลไว้แล้ว โปรดลองอีกครั้ง|提交失败，已保留填写内容，请重试。|提交失敗，已保留填寫內容，請重試。|Не удалось отправить. Данные сохранены в форме; повторите попытку.
No orders yet|ยังไม่มีคำสั่งซื้อ|暂时没有订单|目前沒有訂單|Заказов пока нет
No tickets yet|ยังไม่มีคำร้อง|暂时没有工单|目前沒有工單|Обращений пока нет
Open|รับคำร้องแล้ว|待处理|待處理|Получено
In progress|กำลังดำเนินการ|处理中|處理中|В работе
Waiting for customer|รอลูกค้าตอบกลับ|等待客户补充|等待客戶補充|Ожидается ответ клиента
Resolved|แก้ไขแล้ว|已解决|已解決|Решено
Closed|ปิดแล้ว|已关闭|已關閉|Закрыто
Staff reply|คำตอบจากเจ้าหน้าที่|客服回复|客服回覆|Ответ сотрудника
Refresh|รีเฟรช|刷新|重新整理|Обновить
Please check the selected order and product.|โปรดตรวจสอบคำสั่งซื้อและสินค้า|请检查所选订单、商品及问题信息。|請檢查所選訂單、商品及問題資訊。|Проверьте выбранный заказ, товар и описание.
Too many requests. Please try again later.|ส่งคำร้องบ่อยเกินไป โปรดลองภายหลัง|提交过于频繁，请稍后再试。|提交過於頻繁，請稍後再試。|Слишком много запросов. Повторите позже.
Continue in live support|ติดต่อผ่านแชต|转到在线客服补充说明|前往線上客服補充說明|Продолжить в чате
`;
export const ticketDictionary=Object.fromEntries(rows.trim().split('\n').map(row=>{const [key,...values]=row.split('|');return [key,values];}));
export function ticketText(key:string,locale:Locale){const index=['th','zh-CN','zh-TW','ru'].indexOf(locale);return index<0?key:ticketDictionary[key]?.[index]||key;}
export const issueLabels:Record<string,string>={product_details:'Product information',availability:'Availability',delivery:'Delivery',mold:'Mold or quality issue',damaged:'Damaged item',wrong_item:'Wrong item',missing_item:'Missing item',other:'Other'};
export const resolutionLabels:Record<string,string>={exchange_same:'Return and replace with the same product',exchange_other:'Return and exchange for another product',refund:'Return and refund',other:'Describe another solution'};
export const categoryLabels:Record<string,string>={pre_sales:'Pre-sales inquiry',after_sales:'After-sales service',other:'Other request'};
export const statusLabels:Record<string,string>={open:'Open',in_progress:'In progress',waiting_customer:'Waiting for customer',resolved:'Resolved',closed:'Closed'};
