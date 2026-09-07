import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ASSISTANTS, canRoleAccess, createDemoState } from '../lib/assistant-chat/config.ts';
import { assistantText } from '../lib/assistant-chat/copy.ts';
import { mockIntentMatcher } from '../lib/assistant-chat/mock-intent.ts';
import { mockProductLookup } from '../lib/assistant-chat/mock-product-catalog.ts';

void test('conversation center defines five shared assistant channels with private feedback visibility',()=>{
 assert.deepEqual(ASSISTANTS.map(item=>item.channel),['assistant','human_support','delivery','feedback_private','wholesale']);
 const feedback=ASSISTANTS.find(item=>item.channel==='feedback_private');
 assert.deepEqual(feedback?.visibility,['owner','admin']);assert.equal(feedback?.private,true);
 assert.equal(canRoleAccess(feedback!,'owner'),true);assert.equal(canRoleAccess(feedback!,'admin'),true);assert.equal(canRoleAccess(feedback!,'staff'),false);
 const wholesale=ASSISTANTS.find(item=>item.channel==='wholesale');
 assert.deepEqual(wholesale?.visibility,['owner','admin']);assert.equal(canRoleAccess(wholesale!,'staff'),false);
 const state=createDemoState();assert.equal(Object.keys(state.conversations).length,5);
 for(const assistant of ASSISTANTS){const conversation=state.conversations[assistant.id];assert.ok(conversation.messages.length>0);assert.ok(conversation.messages.some(message=>message.quickActions?.length));}
});

void test('assistant interface and saved mock messages render in all supported languages',()=>{
 assert.equal(assistantText('Conversations','zh-CN'),'对话');
 assert.equal(assistantText('Delivery Assistant','zh-CN'),'配送助手');
 assert.equal(assistantText('Track My Order','th'),'ติดตามคำสั่งซื้อ');
 assert.equal(assistantText('Private channel · Visible to management only','zh-TW'),'私密頻道 · 僅管理層可見');
 assert.match(assistantText('Please review your inquiry:\n\nProduct: Rolling Papers\nQuantity: 100–500\nLocation: Bangkok\nContact: email','ru'),/Товар: Rolling Papers/);
});

void test('mock AI intent matcher covers the configured local intents without an API',()=>{
 assert.equal(mockIntentMatcher('How do I verify this product?'),'verification');
 assert.equal(mockIntentMatcher('When will my delivery arrive?'),'delivery');
 assert.equal(mockIntentMatcher('门店营业时间是什么？'),'hours');
 assert.equal(mockIntentMatcher('Tell me about Lucky Game'),'lucky_game');
 assert.equal(mockIntentMatcher('I need a wholesale partnership'),'wholesale');
 assert.equal(mockIntentMatcher('Can I talk to staff?'),'human');
 assert.equal(mockIntentMatcher('What color is the moon?'),'unknown');
});

void test('mock product lookup finds MAC and recommends similar varieties when unavailable',()=>{
 const mac=mockProductLookup('请问有 MAC 品种吗？');
 assert.equal(mac?.requested,'MAC');
 assert.deepEqual(mac?.matches.map(item=>item.id),['mac-1-flower','mac-pre-roll']);
 const missing=mockProductLookup('有没有 Blue Dream 品种？');
 assert.equal(missing?.requested,'Blue Dream');
 assert.equal(missing?.matches.length,0);
 assert.deepEqual(missing?.similar.map(item=>item.name),['MAC 1','MAC','Alien Cookies']);
 assert.match(assistantText('I found available products for “MAC” in the local demo catalog. What would you like to check next?','zh-CN'),/找到了“MAC”相关产品/);
 assert.match(assistantText('I couldn’t find “Blue Dream” in the local demo catalog. Here are some similar options:','zh-CN'),/没有找到“Blue Dream”/);
});
