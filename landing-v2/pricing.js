import { getPlanPricesSnapshot, subscribePlanPrices } from '../src/lib/planPricesStore.js'
import { siteConfig, buildWhatsappUrl, whatsappMessages } from '../src/siteConfig.js'
const names = { express: siteConfig.planExpress.name, professional: siteConfig.planProfessional.name, turbo: siteConfig.planTurbo.name }
function render() {
  const prices = getPlanPricesSnapshot()
  document.querySelectorAll('[data-start-price]').forEach(element => { element.textContent = prices.express.price })
  document.querySelectorAll('[data-plan-price]').forEach(element => {
    const key = element.dataset.planPrice
    element.textContent = prices[key].price
    const label = document.createElement('span'); label.textContent = ' à vista'; element.append(label)
    const link = element.closest('.plan').querySelector('a')
    link.href = buildWhatsappUrl(whatsappMessages.plan(names[key], prices[key].price))
  })
  document.querySelectorAll('[data-plan-installment]').forEach(element => {
    const details = prices[element.dataset.planInstallment]
    element.textContent = details.installment
    if (details.installmentNote) {
      const note = document.createElement('small'); note.style.display = 'block'; note.style.marginTop = '8px'; note.textContent = details.installmentNote; element.append(note)
    }
  })
}
render()
const unsubscribe = subscribePlanPrices(render)
window.addEventListener('pagehide', unsubscribe, { once: true })
