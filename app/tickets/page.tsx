import {redirect} from 'next/navigation';

// Ticket APIs are not yet available in the Database service. Keep the route
// from presenting a form that cannot save a customer's request.
export default function Tickets(){redirect('/chat');}
