'use client';
import { useI18n } from '@/lib/support/i18n';
import { useId, useState } from 'react';
import { Link2, UserRound, ExternalLink, Globe, CircleDot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import type { Agent, Conversation, PreviewCustomer } from '@/lib/support/types';

export function VisitorDetails({ conversation, agents, customers, action }: {
    conversation: Conversation;
    agents: Agent[];
    customers: PreviewCustomer[];
    action: (action: string, value: unknown) => Promise<void>;
}) {
    const { t, locale } = useI18n();
    const date = (value:string)=>new Date(value).toLocaleString(locale,{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'});
    const [profile, setProfile] = useState(false), [linking, setLinking] = useState(false), [error, setError] = useState(''), [busy, setBusy] = useState(false), [customerId, setCustomerId] = useState<string | null>(null);
    const assignedId = useId();
    const name = conversation.customer?.displayName || t("Anonymous visitor");
    async function update(actionName: string, value: unknown) { setBusy(true); setError(''); try {
        await action(actionName, value);
        setLinking(false);
    }
    catch (cause) {
        setError(cause instanceof Error ? cause.message : t("Unable to update."));
    }
    finally {
        setBusy(false);
    } }
    return <div className="visitor-details">
  <div className="details-intro"><span className="large-avatar"><UserRound size={29}/></span><h3>{name}</h3><span className="presence-label"><span className={'status-dot ' + (!conversation.online ? 'offline' : '')}/>{conversation.online ? t("Online now") : t("Offline")}</span></div>
  {conversation.sample && <div className="sample-note">{t("Illustrative conversation")}</div>}
  {error && <p className="inline-error" role="alert">{t(error)}</p>}
  <section className="detail-section"><h4><CircleDot size={14}/>{t("Conversation")}</h4><label className="field-label" htmlFor={assignedId}>{t("Assigned to")}</label>
   <Select value={conversation.assignedAgentId || 'unassigned'} onValueChange={value => { void update('assign', value === 'unassigned' ? null : value); }} disabled={busy}>
    <SelectTrigger id={assignedId} className="detail-select"><SelectValue>{agents.find(a => a.id === conversation.assignedAgentId)?.name || t("Unassigned")}</SelectValue></SelectTrigger>
    <SelectContent><SelectItem value="unassigned">{t("Unassigned")}</SelectItem>{agents.map(agent => <SelectItem key={agent.id} value={agent.id}>{agent.name}</SelectItem>)}</SelectContent>
   </Select>
   <dl><div><dt>{t("Channel")}</dt><dd>{t("Web support")}</dd></div><div><dt>{t("Website")}</dt><dd>Alien Farmers</dd></div><div><dt>{t("Started")}</dt><dd>{date(conversation.createdAt)}</dd></div></dl>
  </section>
  <section className="detail-section"><h4><UserRound size={14}/>{t("Visitor information")}</h4><dl><div className="stacked"><dt>{t("Visitor ID")}</dt><dd className="mono">{conversation.visitorId}</dd></div><div><dt>{t("First seen")}</dt><dd>{date(conversation.visitor.firstSeenAt)}</dd></div><div><dt>{t("Last seen")}</dt><dd>{date(conversation.visitor.lastSeenAt)}</dd></div><div><dt>{t("Browser language")}</dt><dd>{conversation.visitor.language}</dd></div><div><dt>{t("First source")}</dt><dd><Globe size={12}/>{t(conversation.visitor.sourceSite)}</dd></div></dl></section>
  <section className="detail-section"><h4><Link2 size={14}/>{t("Customer")}</h4>{conversation.customer ? <><div className="linked-customer"><span className="small-avatar">{conversation.customer.displayName.slice(0, 1)}</span><div><strong>{conversation.customer.displayName}</strong><span>{t(conversation.customer.membershipStatus)} · {t('Sample')}</span></div></div><Button className="detail-button" variant="outline" onClick={() => setProfile(true)}>{t("View sample profile")}<ExternalLink size={13}/></Button><Button variant="ghost" className="unlink-button" disabled={busy} onClick={() => void update('customer', null)}>{t("Unlink customer")}</Button></> : <><p className="not-linked">{t("Not linked")}</p><p className="muted-copy">{t("Link this conversation to a customer once their identity is confirmed.")}</p><Button variant="outline" className="detail-button" onClick={() => setLinking(!linking)}><Link2 size={14}/>{t("Link sample customer")}</Button></>}
   {linking && <div className="link-form"><Select value={customerId} onValueChange={value => setCustomerId(value)}><SelectTrigger className="detail-select" aria-label={t("Sample customer")}><SelectValue placeholder={t("Choose sample customer")}/></SelectTrigger><SelectContent>{customers.map(customer => <SelectItem key={customer.userId} value={customer.userId}>{customer.displayName}</SelectItem>)}</SelectContent></Select><p className="muted-copy">{t("Preview fixtures only. No production customer records are accessed.")}</p><Button disabled={!customerId || busy} onClick={() => void update('customer', customerId)}>{t("Confirm link")}</Button></div>}
  </section>
  <Sheet open={profile} onOpenChange={setProfile}><SheetContent className="customer-sheet"><SheetHeader><SheetTitle>{t("Sample customer profile")}</SheetTitle><SheetDescription>{t("Read-only fixture for this local preview.")}</SheetDescription></SheetHeader>{conversation.customer && <div className="profile-body"><h2>{conversation.customer.displayName}</h2><dl><dt>{t("Customer user ID")}</dt><dd className="mono">{conversation.customer.userId}</dd><dt>{t("Membership")}</dt><dd>{t(conversation.customer.membershipStatus)}</dd><dt>{t("Language")}</dt><dd>{conversation.customer.locale}</dd></dl><p>{t("In production, this opens the existing Operations customer record. Chat does not store a copy of the customer profile.")}</p></div>}</SheetContent></Sheet>
 </div>;
}
