import re

content = open('src/App.tsx').read()

old_code = """    const draftItemsMap = new Map(draftInvoice.items.map(i => [i.itemId, i]));

    originalInvoice.items.forEach(origItem => {
      const draftItem = draftItemsMap.get(origItem.itemId);
      const draftQty = draftItem ? draftItem.quantity : 0;
      const diff = draftQty - origItem.quantity;
      inventoryUpdates.set(origItem.itemId, diff);
    });"""

new_code = """    originalInvoice.items.forEach(origItem => {
      const draftItem = draftInvoice.items.find(i => i.itemId === origItem.itemId);
      const draftQty = draftItem ? draftItem.quantity : 0;
      const diff = draftQty - origItem.quantity;
      inventoryUpdates.set(origItem.itemId, diff);
    });"""

content = content.replace(old_code, new_code)
open('src/App.tsx', 'w').write(content)
print("Fixed.")
