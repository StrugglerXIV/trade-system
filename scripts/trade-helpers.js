/* trade-helpers.js */

/**
 * Validate if an item can be traded (not cursed, equipped, etc.)
 * @param {Item5e} item 
 * @returns {boolean}
 */
export function isItemTradeable(item) {
  const forbiddenTypes = ["class", "spell", "feat"];
  return (
    item.isOwner && 
    !forbiddenTypes.includes(item.type) &&
    !item.system.equipped
  );
}

/**
 * Calculate total currency value (e.g., "5gp 10sp" => { gp:5, sp:10 })
 * @param {Actor5e} actor 
 * @returns {Object}
 */
export function getActorCurrency(actor) {
  return {
    gp: actor.system.currency.gp.value || 0,
    sp: actor.system.currency.sp.value || 0,
    cp: actor.system.currency.cp.value || 0,
    pp: actor.system.currency.pp.value || 0
  };
}

/**
 * Transfer currency between actors
 * @param {Actor5e} fromActor 
 * @param {Actor5e} toActor 
 * @param {Object} currency 
 */
export async function transferCurrency(fromActor, toActor, currency) {
  const fromCurrency = getActorCurrency(fromActor);
  const toCurrency = getActorCurrency(toActor);

  // Validate sufficient funds
  for (const [type, amount] of Object.entries(currency)) {
    if (fromCurrency[type] < amount) {
      throw new Error(`Insufficient ${type}!`);
    }
  }

  // Update both actors
  await fromActor.update({
    "system.currency.gp.value": fromCurrency.gp - (currency.gp || 0),
    "system.currency.sp.value": fromCurrency.sp - (currency.sp || 0),
    "system.currency.cp.value": fromCurrency.cp - (currency.cp || 0),
    "system.currency.pp.value": fromCurrency.pp - (currency.pp || 0)
  });

  await toActor.update({
    "system.currency.gp.value": toCurrency.gp + (currency.gp || 0),
    "system.currency.sp.value": toCurrency.sp + (currency.sp || 0),
    "system.currency.cp.value": toCurrency.cp + (currency.cp || 0),
    "system.currency.pp.value": toCurrency.pp + (currency.pp || 0)
  });
}

/**
 * Transfer items between actors
 * @param {Actor5e} fromActor 
 * @param {Actor5e} toActor 
 * @param {Item5e[]} items 
 */
export async function transferItems(fromActor, toActor, items) {
  const itemsToTransfer = items.filter(item => 
    item.isOwner && isItemTradeable(item)
  );

  if (itemsToTransfer.length !== items.length) {
    console.warn("Trade System | Some items were not tradeable!");
  }

  // Delete from