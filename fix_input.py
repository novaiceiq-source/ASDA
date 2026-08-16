import re

content = open('src/App.tsx').read()

target = """                              <span className="font-bold w-4 text-center">{cartItem.quantity}</span>"""

replacement = """                              <input 
                                type="number"
                                min="1"
                                value={cartItem.quantity}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value);
                                  handleSetCartQuantity(item.id, isNaN(val) ? 0 : val);
                                }}
                                className="font-bold w-12 text-center bg-transparent border-none focus:outline-none focus:ring-0 text-slate-800 dark:text-slate-100 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none p-0 m-0"
                              />"""

if target in content:
    content = content.replace(target, replacement)
    
    # Also add handleSetCartQuantity
    func_target = "  const handleUpdateCartQuantity = (itemId: string, delta: number) => {"
    
    new_func = """  const handleSetCartQuantity = (itemId: string, quantity: number) => {
    const inventoryItem = items.find(i => i.id === itemId);
    if (!inventoryItem) return;

    if (quantity <= 0) {
      setSalesCart(salesCart.filter(ci => ci.itemId !== itemId));
    } else if (quantity > Number(inventoryItem.quantity)) {
      showToast('لا توجد كمية كافية في المخزون', 'error');
      setSalesCart(salesCart.map(ci => 
        ci.itemId === itemId ? { ...ci, quantity: Number(inventoryItem.quantity) } : ci
      ));
    } else {
      setSalesCart(salesCart.map(ci => 
        ci.itemId === itemId ? { ...ci, quantity: quantity } : ci
      ));
    }
  };

  const handleUpdateCartQuantity = (itemId: string, delta: number) => {"""
    
    content = content.replace(func_target, new_func)
    open('src/App.tsx', 'w').write(content)
    print("Updated successfully")
else:
    print("Target not found")
