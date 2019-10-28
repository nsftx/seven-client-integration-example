const style = `<style>
.table {
  width: 100%;
  max-width: 100%;
  background: #242424;
  margin-bottom: 0.65rem;
  font-size: 1rem;
  line-height: 1.3;
  color: #fff;
  border-collapse: collapse;
  border-spacing: 0;
}

.table tbody {
  background-color: #242424;
}

.table .is--dark {
    background: rgba(0, 0, 0, 0.4);
}

.table thead, .table tbody, .table tfoot {
  border: none;
}

.table thead tr {
  color: #e6e6e6;
  border: 0;
}

td, th {
  padding: 0;
}

th {
  text-align: left;
}

.table th, .table td {
  line-height: 1.8;
  font-weight: 400;
  display: table-cell;
}

.table tbody td {
  color: #fff;
}

.table thead tr th {
  background-repeat: no-repeat;
  background-position: center;
}

.p-l-1 {
  padding-left: 0.65rem !important;
}

.p-y-1 {
  padding-top: 0.65rem !important;
  padding-bottom: 0.65rem !important;
}

.text-uppercase {
  text-transform: uppercase !important;
}

.results-number {
  display: inline-block;
  width: 2.5em;
  height: 2.5em;
  line-height: 2.5em;
  margin-top: 3px;
  margin-left: 4px;
  background: #424142;
  font-family: robotoRegular;
  color: #acacad;
  text-align: center;
  border-radius: 3px;
}

.results-number.active {
  background: #0066ae;
  color: #fff;
}
</style>`;

function compile(ticket, options) {
  const currencyDisplayName = options.currency.displayName;
  const translations = options.translations;
  let result = style;
  result += '<table class="table">';
  result += '<thead>';

  result += '<tr>';
  result += `<th colspan="1" class="p-l-1">${translations.game}</th>`;
  result += ticket.payin > ticket.bet ? `<th colspan="3">${translations.ticketId}</th>` : '';
  result += !(ticket.payin > ticket.bet) ? `<th colspan="5">${translations.ticketId}</th>` : '';
  result += ticket.payin > ticket.bet ? `<th colspan="1">${translations.payin}</th>` : '';
  result += ticket.payin > ticket.bet ? ` <th colspan="1">${translations.payinTax}` : '';
  result += `<th colspan="1"${translations.stake}</th>`;
  result += '</tr>'; 

  result += '<tr>';
  result += `<th colspan="1" class="p-l-1">${ticket.product}</th>`;
  result += ticket.payin > ticket.bet ? `<th colspan="3">${ticket.id}</th>` : '';
  result += !(ticket.payin > ticket.bet) ? `<th colspan="5">${ticket.id}</th>` : '';
  result += ticket.payin > ticket.bet ? `<th colspan="1">${ticket.payin.toFixed(2)} ${currencyDisplayName}</th>` : '';
  result += ticket.payin > ticket.bet ? ` <th colspan="1">${ticket.payinTax}` : '';
  result += `<th colspan="1">${ticket.payin > ticket.bet ? ticket.bet : ticket.payin.toFixed(2)} ${currencyDisplayName}</th>`;
  result += '</tr>'; 

  result += '<tr class="is--dark text-uppercase">';
  result += `<th colspan="1" class="p-l-1">${translations.type}</th>`;
  result += `<th colspan="2">${translations.bet}</th>`;
  result += `<th colspan="1">${translations.event}</th>`;
  result += `<th colspan="1">${translations.stake}</th>`
  result += `<th colspan="1">${translations.status}</th>`;
  result += `<th colspan="1">${translations.winnings}</th>`;
  result += '</tr>'; 
  result += '</thead>';

  ticket.bets.forEach(bet => {
    result += '<tbody>';
    result += '<tr>';
    result += `<td colspan="1" class="p-l-1 p-y-1">${bet.bet.title}</td>`;
    result += '<td colspan="2" class="text-uppercase p-y-1">';
    if (bet.bet.id < 20) {
      bet.outcome.value.forEach(ball => {
        result += `<div class="results-number ${bet.outcome.drawn && bet.outcome.drawn.indexOf(ball) !== -1 ? 'active' : ''}">
        ${ball}
        </div>`;
      });
    }
    result += '</td>';
    result += `<td colspan="1" class="p-y-1"><span>${translations.event} ${bet.eventId}</span></td>`;
    result += `<td colspan="1" class="p-y-1"><span>${bet.amount.toFixed(2)} ${currencyDisplayName}</span></td>`;
    result += `<td colspan="1" class="p-y-1"><span>${bet.status.value}</span></td>`;
    result += `<td colspan="1" class="p-y-1"><span>${bet.winnings.toFixed(2) || 0.00} ${currencyDisplayName}</span></td>`;
    result += '</tr>';
    result += '</tbody>';
  });

  result += '<tfoot>';
  result += '<tr>';
  result += ticket.payin > ticket.bet ? `<td colspan="4" class="p-l-1">${translations.status}</td>` : '';
  result += !(ticket.payin > ticket.bet) ? `<td colspan="6" class="p-l-1">${translations.status}</td>` : '';
  result += ticket.payin > ticket.bet ? `<td colspan="2">${translations.winnings}</td>` : '';
  result += ticket.payin > ticket.bet ?  `<td colspan="1">${translations.payoutTax}</td>` : '';
  result += `<td colspan="1">${translations.payout}</td>`
  result += '</tr>'; 
  result += '<tr>';
  result += ticket.payin > ticket.bet ? `<td colspan="4" class="p-l-1">${ticket.status.value}</td>` : '';
  result += !(ticket.payin > ticket.bet) ? `<td colspan="6" class="p-l-1">${ticket.status.value}</td>` : '';
  result += ticket.payin > ticket.bet ? `<td colspan="2">${ticket.winnings.toFixed(2)}</td>` : '';
  result += ticket.payin > ticket.bet ?  `<td colspan="1">${ticket.payoutTax.toFixed(2)}</td>` : '';
  result += `<td colspan="1">`;
  result += ticket.status.value.toLowerCase() == 'open' || ticket.status.value.toLowerCase() == 'in_play' ? '' : `<span>${ticket.status.value == 'PAYEDOUT' ? ticket.payout.toFixed(2) : ticket.winnings.toFixed(2)} ${currencyDisplayName}</span>`;
  result += ticket.status.value.toLowerCase() == 'open' || ticket.status.value.toLowerCase() == 'in_play' || ticket.status.value.toLowerCase() == 'closed' ? `<span>0.00 ${currencyDisplayName}</span>` : '';
  result += `</td>`;
  result += '</tr>'; 
  result += '</tfoot>';
  
  result += '</tbody>';
  result += '</table>';
  return result;
}

class TicketDetials extends HTMLElement {
  constructor() {
    console.info('[Keno.TicketDetials] Instating...');
    super();
    this.attachShadow({mode: 'open'});
  }

  static get observedAttributes() { return ['ticket', 'translations', 'currency']; }


  attributeChangedCallback(attr, oldVal, newVal) {
    console.info('[Keno.TicketDetials] TicketDetials attribute changed:', attr)
    console.info('[Keno.TicketDetials] TicketDetials old value:', oldVal);
    console.info('[Keno.TicketDetials] TicketDetials: new value', newVal);
    if (this.getAttribute('ticket') 
        && this.getAttribute('currency')
        && this.getAttribute('translations')) {
      this.shadowRoot.innerHTML = compile(JSON.parse(this.getAttribute('ticket')), {
        translations: JSON.parse(this.getAttribute('translations')),
        currency: JSON.parse(this.getAttribute('currency'))
      });
    }
  }
}
  
customElements.define('seven-widget-keno-ticket-details', TicketDetials);
