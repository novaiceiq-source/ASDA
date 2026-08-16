import React, { useState, useEffect, useRef } from 'react';
import { Plus, Minus, Package, DollarSign, Archive, Check, Droplets, ChevronLeft, Save, Sun, Moon, Clock, Settings, Users, ShieldAlert, Lock, UserPlus, Phone, Edit2, Trash2, X, ShoppingCart , Camera, Image as ImageIcon , BarChart3, PieChart, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useMutation, useQuery } from 'convex/react';
import { api } from './convex/_generated/api';

interface InventoryItem {
  id: string;
  name: string;
  purchasePrice: string;
  sellPrice: string;
  quantity: string;
}

interface Delegate {
  id: string;
  name: string;
  whatsapp: string;
}

interface Transaction {
  id: string;
  itemId: string;
  itemName: string;
  addedQuantity: number;
  shift: string;
  date: string;
}

interface CartItem {
  itemId: string;
  name: string;
  quantity: number;
  sellPrice: number;
  purchasePrice: number;
}

interface Invoice {
  id: string;
  delegateId: string;
  delegateName: string;
  items: CartItem[];
  totalAmount: number;
  date: string;
}

interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
}

export default function App() {
  // Inventory State
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [newItem, setNewItem] = useState({ name: '', purchasePrice: '', sellPrice: '', quantity: '' });
  const [editItemModal, setEditItemModal] = useState({ isOpen: false, id: '', name: '', purchasePrice: '', sellPrice: '' });
  const [addQuantityModal, setAddQuantityModal] = useState({ isOpen: false, itemId: '', itemName: '', addedQuantity: '', shift: 'الشفت الاول' });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  const [activeTab, setActiveTab] = useState('inventory');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(() => localStorage.getItem('nova_logo'));

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        setLogoUrl(url);
        localStorage.setItem('nova_logo', url);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // Shifts State
  const [shifts, setShifts] = useState(['الشفت الاول', 'الشفت الثاني', 'الشفت الثالث']);
  const [editShiftModal, setEditShiftModal] = useState({ isOpen: false, index: 0, oldName: '', newName: '' });

  // Delegates State
  const [delegates, setDelegates] = useState<Delegate[]>([]);
  const [delegateModal, setDelegateModal] = useState({ isOpen: false, id: '', name: '', whatsapp: '' });

  // Accounts Lock State

  const [isReportsUnlocked, setIsReportsUnlocked] = useState(false);
  const [adminPin, setAdminPin] = useState(() => localStorage.getItem('nova_admin_pin') || '1234');
  const [reportsPin, setReportsPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [reportsView, setReportsView] = useState<'menu' | 'shifts' | 'inventory_settings' | 'shift_details' | 'delegates_settings' | 'financial' | 'delegate_stats' | 'delegate_stats_detail' | 'change_pin'>('menu');
  const [changePinData, setChangePinData] = useState({ currentPin: '', newPin: '', confirmPin: '' });
  const [statsDelegateId, setStatsDelegateId] = useState<string | null>(null);
  const [mainDelegateId, setMainDelegateId] = useState<string | null>(null);
  const [statsPeriod, setStatsPeriod] = useState<'today' | 'week' | 'month' | 'year'>('today');
  const [draftInvoice, setDraftInvoice] = useState<Invoice | null>(null);
  const [selectedShift, setSelectedShift] = useState('');


  // Expenses State
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [expenseModal, setExpenseModal] = useState({ isOpen: false, description: '', amount: '' });

  // Sales & Invoices State
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [salesDelegateId, setSalesDelegateId] = useState('');
  const [salesCart, setSalesCart] = useState<CartItem[]>([]);
  const [invoiceReceipt, setInvoiceReceipt] = useState<Invoice | null>(null);
  const [viewedDelegateId, setViewedDelegateId] = useState<string | null>(null);

  // Toast State
  const [toast, setToast] = useState<{show: boolean, message: string, type: 'success' | 'error' | 'info'}>({ show: false, message: '', type: 'info' });
  const [confirmModal, setConfirmModal] = useState<{isOpen: boolean, message: string, onConfirm: () => void}>({isOpen: false, message: '', onConfirm: () => {}});
  const remoteAppState = useQuery(api.appState.get);
  const saveAppState = useMutation(api.appState.save);
  const hasLoadedRemoteState = useRef(false);
  const lastSyncedState = useRef<string | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  };

  useEffect(() => {
    if (remoteAppState === undefined) return;

    const serialized = JSON.stringify(remoteAppState);
    if (serialized === lastSyncedState.current) return;

    lastSyncedState.current = serialized;
    setItems(remoteAppState.items);
    setTransactions(remoteAppState.transactions);
    setShifts(remoteAppState.shifts);
    setDelegates(remoteAppState.delegates);
    setExpenses(remoteAppState.expenses);
    setInvoices(remoteAppState.invoices);
    hasLoadedRemoteState.current = true;
  }, [remoteAppState]);

  useEffect(() => {
    if (!hasLoadedRemoteState.current) return;

    const data = { items, transactions, shifts, delegates, expenses, invoices };
    const serialized = JSON.stringify(data);
    if (serialized === lastSyncedState.current) return;

    const timeout = window.setTimeout(() => {
      lastSyncedState.current = serialized;
      void saveAppState({ data }).catch(() => {
        lastSyncedState.current = null;
        showToast('تعذر حفظ البيانات في قاعدة البيانات', 'error');
      });
    }, 350);

    return () => window.clearTimeout(timeout);
  }, [items, transactions, shifts, delegates, expenses, invoices, saveAppState]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleEditShiftSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editShiftModal.newName.trim()) return;
    
    const newShifts = [...shifts];
    newShifts[editShiftModal.index] = editShiftModal.newName;
    setShifts(newShifts);
    
    setTransactions(transactions.map(t => 
      t.shift === editShiftModal.oldName ? { ...t, shift: editShiftModal.newName } : t
    ));
    
    setEditShiftModal({ isOpen: false, index: 0, oldName: '', newName: '' });
    showToast('تم تعديل اسم الشفت بنجاح!', 'success');
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name || !newItem.purchasePrice || !newItem.sellPrice || !newItem.quantity) return;
    
    setItems([{ id: Date.now().toString(), ...newItem }, ...items]);
    setNewItem({ name: '', purchasePrice: '', sellPrice: '', quantity: '' });
    showToast('تمت إضافة العنصر للمخزون بنجاح!', 'success');
  };

  const handleEditItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editItemModal.name || !editItemModal.purchasePrice || !editItemModal.sellPrice) return;
    
    setItems(items.map(item => 
      item.id === editItemModal.id 
        ? { ...item, name: editItemModal.name, purchasePrice: editItemModal.purchasePrice, sellPrice: editItemModal.sellPrice } 
        : item
    ));
    setEditItemModal({ isOpen: false, id: '', name: '', purchasePrice: '', sellPrice: '' });
    showToast('تم تعديل العنصر بنجاح!', 'success');
  };

  const handleAddQuantitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addQuantityModal.itemId || !addQuantityModal.addedQuantity) return;
    
    const qtyToAdd = parseInt(addQuantityModal.addedQuantity) || 0;
    
    setItems(items.map(item => 
      item.id === addQuantityModal.itemId 
        ? { ...item, quantity: (parseInt(item.quantity || '0') + qtyToAdd).toString() } 
        : item
    ));

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      itemId: addQuantityModal.itemId,
      itemName: addQuantityModal.itemName,
      addedQuantity: qtyToAdd,
      shift: addQuantityModal.shift,
      date: new Date().toISOString()
    };
    setTransactions([newTransaction, ...transactions]);

    setAddQuantityModal({ isOpen: false, itemId: '', itemName: '', addedQuantity: '', shift: 'الشفت الاول' });
    showToast('تمت الإضافة للمخزون!', 'success');
  };

  const handleSaveDelegate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!delegateModal.name || !delegateModal.whatsapp) return;
    
    if (delegateModal.id) {
      // Edit
      setDelegates(delegates.map(d => d.id === delegateModal.id ? { ...d, name: delegateModal.name, whatsapp: delegateModal.whatsapp } : d));
      showToast('تم تعديل بيانات المندوب بنجاح!', 'success');
    } else {
      // Add
      setDelegates([{ id: Date.now().toString(), name: delegateModal.name, whatsapp: delegateModal.whatsapp }, ...delegates]);
      showToast('تمت إضافة المندوب بنجاح!', 'success');
    }
    setDelegateModal({ isOpen: false, id: '', name: '', whatsapp: '' });
  };

  const handleDeleteDelegate = (id: string) => {
    setConfirmModal({
      isOpen: true,
      message: 'هل أنت متأكد من حذف هذا المندوب؟',
      onConfirm: () => {
        setDelegates(delegates.filter(d => d.id !== id));
        showToast('تم حذف المندوب', 'success');
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };


  const handleSaveExpense = () => {
    if (!expenseModal.description || !expenseModal.amount) {
      showToast('يرجى تعبئة جميع الحقول', 'error');
      return;
    }
    
    setExpenses([{ 
      id: Date.now().toString(), 
      description: expenseModal.description, 
      amount: Number(expenseModal.amount), 
      date: new Date().toISOString() 
    }, ...expenses]);
    
    showToast('تم تسجيل المصروف بنجاح!', 'success');
    setExpenseModal({ isOpen: false, description: '', amount: '' });
  };

  const handleAddToCart = (item: InventoryItem) => {
    const existing = salesCart.find(ci => ci.itemId === item.id);
    if (existing) {
      if (existing.quantity >= Number(item.quantity)) {
        showToast('لا توجد كمية كافية في المخزون', 'error');
        return;
      }
      setSalesCart(salesCart.map(ci => 
        ci.itemId === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci
      ));
    } else {
      if (Number(item.quantity) < 1) {
        showToast('العنصر غير متوفر في المخزون', 'error');
        return;
      }
      setSalesCart([...salesCart, { 
        itemId: item.id, 
        name: item.name, 
        quantity: 1, 
        sellPrice: Number(item.sellPrice),
        purchasePrice: Number(item.purchasePrice)
      }]);
    }
  };

  const handleSetCartQuantity = (itemId: string, quantity: number) => {
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

  const handleUpdateCartQuantity = (itemId: string, delta: number) => {
    const cartItem = salesCart.find(ci => ci.itemId === itemId);
    const inventoryItem = items.find(i => i.id === itemId);
    if (!cartItem || !inventoryItem) return;

    const newQuantity = cartItem.quantity + delta;
    if (newQuantity <= 0) {
      setSalesCart(salesCart.filter(ci => ci.itemId !== itemId));
    } else if (newQuantity > Number(inventoryItem.quantity)) {
      showToast('لا توجد كمية كافية في المخزون', 'error');
    } else {
      setSalesCart(salesCart.map(ci => 
        ci.itemId === itemId ? { ...ci, quantity: newQuantity } : ci
      ));
    }
  };

  const handleCheckout = () => {
    if (!salesDelegateId) {
      showToast('يرجى اختيار المندوب أولاً', 'error');
      return;
    }
    if (salesCart.length === 0) {
      showToast('السلة فارغة', 'error');
      return;
    }

    const delegate = delegates.find(d => d.id === salesDelegateId);
    if (!delegate) return;

    const totalAmount = salesCart.reduce((sum, item) => sum + (item.sellPrice * item.quantity), 0);

    const newInvoice: Invoice = {
      id: `INV-${Date.now()}`,
      delegateId: delegate.id,
      delegateName: delegate.name,
      items: [...salesCart],
      totalAmount,
      date: new Date().toISOString()
    };

    // Deduct from inventory
    const updatedItems = items.map(item => {
      const cartItem = salesCart.find(ci => ci.itemId === item.id);
      if (cartItem) {
        return { ...item, quantity: String(Number(item.quantity) - cartItem.quantity) };
      }
      return item;
    });

    setItems(updatedItems);
    setInvoices([newInvoice, ...invoices]);
    setSalesCart([]);
    setInvoiceReceipt(newInvoice);
    showToast('تمت عملية البيع بنجاح!', 'success');
  };

    const handleDraftUpdateQty = (itemId: string, delta: number) => {
    if (!draftInvoice) return;
    setDraftInvoice({
      ...draftInvoice,
      items: draftInvoice.items.map(item =>
        item.itemId === itemId ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
      )
    });
  };

  const handleDraftSetQty = (itemId: string, quantity: number) => {
    if (!draftInvoice) return;
    setDraftInvoice({
      ...draftInvoice,
      items: draftInvoice.items.map(item =>
        item.itemId === itemId ? { ...item, quantity: Math.max(0, quantity) } : item
      )
    });
  };

  const handleSaveInvoiceEdit = () => {
    if (!draftInvoice) return;
    const originalInvoice = invoices.find(i => i.id === draftInvoice.id);
    if (!originalInvoice) return;

    let hasError = false;
    const inventoryUpdates = new Map<string, number>();

    originalInvoice.items.forEach(origItem => {
      const draftItem = draftInvoice.items.find(i => i.itemId === origItem.itemId);
      const draftQty = draftItem ? draftItem.quantity : 0;
      const diff = draftQty - origItem.quantity;
      inventoryUpdates.set(origItem.itemId, diff);
    });

    draftInvoice.items.forEach(draftItem => {
       if (!inventoryUpdates.has(draftItem.itemId)) {
          inventoryUpdates.set(draftItem.itemId, draftItem.quantity);
       }
    });

    for (const [itemId, diff] of Array.from(inventoryUpdates.entries())) {
       if (diff > 0) {
          const invItem = items.find(i => i.id === itemId);
          if (!invItem || Number(invItem.quantity) < diff) {
             const itemName = draftInvoice.items.find(i => i.itemId === itemId)?.name || 'عنصر';
             showToast(`الكمية المتوفرة لا تكفي لـ ${itemName}`, 'error');
             hasError = true;
             break;
          }
       }
    }

    if (hasError) return;

    const newItems = items.map(invItem => {
       const diff = inventoryUpdates.get(invItem.id);
       if (diff !== undefined) {
          return { ...invItem, quantity: String(Number(invItem.quantity) - diff) };
       }
       return invItem;
    });

    const validDraftItems = draftInvoice.items.filter(i => i.quantity > 0);
    if (validDraftItems.length === 0) {
      setInvoices(invoices.filter(inv => inv.id !== draftInvoice.id));
    } else {
      const newTotalAmount = validDraftItems.reduce((sum, item) => sum + (item.sellPrice * item.quantity), 0);
      const finalInvoice = { ...draftInvoice, totalAmount: newTotalAmount, items: validDraftItems };
      setInvoices(invoices.map(inv => inv.id === finalInvoice.id ? finalInvoice : inv));
    }

    setItems(newItems);
    setDraftInvoice(null);
    showToast('تم حفظ تعديلات الفاتورة بنجاح', 'success');
  };

  const handleUnlockReports = (e: React.FormEvent) => {
    e.preventDefault();
    if (reportsPin === adminPin) {
      setIsReportsUnlocked(true);
      setPinError(false);
      setReportsPin('');
    } else {
      setPinError(true);
      setTimeout(() => setPinError(false), 500);
    }
  };

  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (changePinData.currentPin !== adminPin) {
      showToast('الرمز الحالي غير صحيح', 'error');
      return;
    }
    if (changePinData.newPin !== changePinData.confirmPin) {
      showToast('الرمز الجديد غير متطابق', 'error');
      return;
    }
    if (changePinData.newPin.length < 4) {
      showToast('يجب أن يتكون الرمز من 4 أرقام على الأقل', 'error');
      return;
    }
    setAdminPin(changePinData.newPin);
    localStorage.setItem('nova_admin_pin', changePinData.newPin);
    showToast('تم تغيير رمز الدخول بنجاح!', 'success');
    setChangePinData({ currentPin: '', newPin: '', confirmPin: '' });
    setReportsView('menu');
  };


  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans overflow-hidden transition-colors duration-300">
      
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-200/40 dark:bg-blue-900/20 blur-3xl mix-blend-multiply dark:mix-blend-lighten transition-colors duration-300"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-cyan-200/40 dark:bg-cyan-900/20 blur-3xl mix-blend-multiply dark:mix-blend-lighten transition-colors duration-300"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 pt-12 pb-6 px-6 bg-gradient-to-b from-blue-50/90 dark:from-slate-950/90 to-transparent backdrop-blur-md transition-colors duration-300">
        <div className="flex items-center gap-3 mb-2">
          {logoUrl ? (
            <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center shrink-0 overflow-hidden border border-slate-100 dark:border-slate-700">
              <img src={logoUrl} alt="شعار الشركة" className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400 to-cyan-400 shadow-3d-button flex items-center justify-center text-white shrink-0">
              <Droplets className="w-8 h-8 drop-shadow-md" />
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight text-shadow-sm transition-colors duration-300">شركة نوڤا</h1>
            <p className="text-sm font-semibold text-blue-600/80 dark:text-blue-400/80 transition-colors duration-300">لإنتاج الثلج البلوري</p>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 relative z-10 px-4 pb-28 overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'inventory' && (
            <motion.div
              key="inventory"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Items List */}
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-slate-700 dark:text-slate-300 px-2 flex items-center gap-2 transition-colors duration-300">
                  <Archive className="w-5 h-5 text-blue-500" />
                  العناصر المخزونة
                </h2>
                
                {items.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 dark:text-slate-500 font-medium transition-colors duration-300">
                    لا توجد عناصر في المخزون
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {items.map((item, idx) => (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        key={item.id} 
                        className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-[0_8px_20px_-6px_rgba(0,0,0,0.08),_inset_0_2px_4px_rgba(255,255,255,0.8),_inset_0_-2px_6px_rgba(0,0,0,0.02)] dark:shadow-[0_8px_20px_-6px_rgba(0,0,0,0.3),_inset_0_1px_3px_rgba(255,255,255,0.05),_inset_0_-2px_6px_rgba(0,0,0,0.2)] border border-slate-100/60 dark:border-slate-800 relative overflow-hidden group transform transition-all duration-300 hover:scale-[1.02]"
                      >
                        {/* Decorative subtle gradient background and bottom border */}
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-cyan-100/30 dark:from-cyan-900/20 to-transparent rounded-full blur-xl pointer-events-none transition-colors duration-300"></div>
                        <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-400 to-cyan-300 opacity-90"></div>
                        
                        <div className="flex justify-between items-start mb-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/40 dark:to-cyan-900/40 border border-white dark:border-slate-700 shadow-[inset_0_1px_3px_rgba(0,0,0,0.05)] flex items-center justify-center text-blue-500 transition-colors duration-300">
                              <Droplets className="w-5 h-5 drop-shadow-sm" />
                            </div>
                            <h3 className="text-lg font-extrabold text-slate-800 dark:text-slate-100 transition-colors duration-300">{item.name}</h3>
                          </div>
                          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 shadow-md px-3 py-1.5 rounded-full flex items-center gap-1.5 text-white">
                            <span className="font-bold text-sm drop-shadow-sm">{item.quantity}</span>
                            <Package className="w-4 h-4 drop-shadow-sm" />
                          </div>
                        </div>
                        
                        <div className="flex gap-4 mb-4">
                          <div className="flex-1 bg-blue-50/40 dark:bg-blue-900/20 rounded-2xl p-3 border border-blue-100 dark:border-blue-900/50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] dark:shadow-none flex flex-col justify-center items-center transition-colors duration-300">
                            <span className="text-[11px] text-blue-600 dark:text-blue-400 font-bold mb-1">البيع</span>
                            <div className="flex items-baseline gap-1 text-blue-800 dark:text-blue-300 transition-colors duration-300">
                              <span className="font-extrabold text-lg">{item.sellPrice}</span>
                              <span className="text-[10px] text-blue-400 dark:text-blue-500 font-bold">د.ع</span>
                            </div>
                          </div>
                        </div>
                        
                        <button 
                          onClick={() => setAddQuantityModal({ isOpen: true, itemId: item.id, itemName: item.name, addedQuantity: '', shift: 'الشفت الاول' })}
                          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold text-sm hover:bg-blue-100 dark:hover:bg-blue-900/40 active:scale-95 transition-all"
                        >
                          <Plus className="w-5 h-5" />
                          إضافة إنتاج
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
          {activeTab === 'delegates' && (
            <motion.div
              key="delegates"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6 pb-20"
            >
              {!mainDelegateId ? (
                <div className="space-y-4">
                  <h2 className="text-lg font-bold text-slate-700 dark:text-slate-300 px-2 flex items-center gap-2 transition-colors duration-300">
                    <Users className="w-5 h-5 text-blue-500" />
                    قائمة المندوبين
                  </h2>
                  
                  {delegates.length === 0 ? (
                    <div className="text-center py-12 text-slate-400 dark:text-slate-500 font-medium transition-colors duration-300">
                      لا يوجد مندوبين حالياً
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {delegates.map((del, idx) => (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          key={del.id}
                          onClick={() => setMainDelegateId(del.id)}
                          className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-[0_8px_20px_-6px_rgba(0,0,0,0.08),_inset_0_2px_4px_rgba(255,255,255,0.8),_inset_0_-2px_6px_rgba(0,0,0,0.02)] dark:shadow-[0_8px_20px_-6px_rgba(0,0,0,0.3),_inset_0_1px_3px_rgba(255,255,255,0.05),_inset_0_-2px_6px_rgba(0,0,0,0.2)] border border-slate-100/60 dark:border-slate-800 relative overflow-hidden flex flex-col gap-4 cursor-pointer active:scale-[0.98] transition-transform"
                        >
                          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-50 to-transparent dark:from-blue-900/20 rounded-bl-full -z-10 transition-colors duration-300"></div>
                          
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/40 dark:to-cyan-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-inner">
                                <Users className="w-6 h-6" />
                              </div>
                              <div>
                                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 transition-colors duration-300">{del.name}</h3>
                                <a href={`https://wa.me/${del.whatsapp}`} onClick={(e) => e.stopPropagation()} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm font-semibold text-emerald-500 dark:text-emerald-400 hover:text-emerald-600 transition-colors">
                                  <Phone className="w-4 h-4" />
                                  <span dir="ltr">{del.whatsapp}</span>
                                </a>
                              </div>
                            </div>
                            <ChevronLeft className="w-5 h-5 text-slate-400 dark:text-slate-600" />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  {(() => {
                    const delegate = delegates.find(d => d.id === mainDelegateId);
                    if (!delegate) return null;

                    const now = new Date();
                    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
                    
                    const dailyInvoices = invoices.filter(inv => 
                      inv.delegateId === delegate.id && 
                      new Date(inv.date).getTime() >= startOfDay
                    );

                    return (
                      <div>
                        <div className="flex items-center gap-3 mb-6">
                          <button 
                            onClick={() => setMainDelegateId(null)}
                            className="p-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 active:scale-95 transition-all"
                          >
                            <ChevronLeft className="w-5 h-5 rotate-180" />
                          </button>
                          <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                            <TrendingUp className="w-6 h-6 text-indigo-500" />
                            مبيعات {delegate.name} اليوم
                          </h2>
                        </div>

                        {/* Recent Invoices List */}
                        <div>
                          {dailyInvoices.length === 0 ? (
                            <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 text-center text-slate-500 shadow-sm border border-slate-100 dark:border-slate-800">
                              لا توجد عمليات بيع مسجلة اليوم لهذا المندوب
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {dailyInvoices.slice().reverse().map((inv) => (
                                <div key={inv.id} className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800">
                                  <div className="flex justify-between items-center mb-3">
                                    <div>
                                      <div className="text-sm font-semibold text-slate-500">{new Date(inv.date).toLocaleString('ar-IQ', { hour: 'numeric', minute: 'numeric', hour12: true })}</div>
                                      <div className="font-bold text-slate-800 dark:text-slate-100 text-xs mt-0.5">{inv.id}</div>
                                    </div>
                                    <div className="text-left">
                                      <div className="font-black text-indigo-600 dark:text-indigo-400 text-lg">{inv.totalAmount.toLocaleString()} د.ع</div>
                                    </div>
                                  </div>
                                  <div className="flex justify-between items-center border-t border-slate-100 dark:border-slate-800 pt-3">
                                    <div className="text-sm font-bold text-slate-500">{inv.items.reduce((s, i) => s + i.quantity, 0)} قطع مباعة</div>
                                    <button 
                                      onClick={() => setDraftInvoice(JSON.parse(JSON.stringify(inv)))}
                                      className="flex items-center gap-1.5 text-sm font-bold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-4 py-2 rounded-xl hover:bg-orange-100 dark:hover:bg-orange-900/40 transition-colors active:scale-95"
                                    >
                                      <Edit2 className="w-4 h-4" />
                                      تعديل الفاتورة
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'reports' && (
            <motion.div
              key="reports"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full flex flex-col"
            >
              {!isReportsUnlocked ? (
                <div className="flex-1 flex flex-col items-center justify-center px-4 -mt-10">
                  <motion.div 
                    animate={pinError ? { x: [-10, 10, -10, 10, 0] } : {}}
                    transition={{ duration: 0.4 }}
                    className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.4)] border border-slate-100/60 dark:border-slate-800 text-center"
                  >
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-500 shadow-inner">
                      <Lock className="w-10 h-10 drop-shadow-sm" />
                    </div>
                    <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 mb-2">منطقة الإدارة</h2>
                    <p className="text-slate-500 dark:text-slate-400 font-semibold mb-8 text-sm">
                      هذا القسم خاص في الإدارة، يرجى إدخال الرمز السري للمتابعة.
                    </p>
                    
                    <form onSubmit={handleUnlockReports} className="space-y-4">
                      <input
                        type="password"
                        inputMode="numeric"
                        value={reportsPin}
                        onChange={(e) => setReportsPin(e.target.value)}
                        placeholder="••••"
                        className={`w-full text-center tracking-[0.5em] font-bold text-2xl py-4 rounded-2xl shadow-3d-input border-none focus:ring-2 outline-none transition-all ${pinError ? 'bg-red-50 dark:bg-red-900/10 text-red-600 focus:ring-red-400/50 placeholder-red-300' : 'bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:ring-blue-400/50 placeholder-slate-300 dark:placeholder-slate-700'}`}
                      />
                      <button 
                        type="submit"
                        className="w-full rounded-2xl py-4 bg-gradient-to-r from-slate-800 to-slate-700 dark:from-blue-600 dark:to-cyan-600 text-white font-bold text-lg shadow-3d-button active:scale-95 transition-all flex justify-center items-center gap-2"
                      >
                        <ShieldAlert className="w-5 h-5 drop-shadow-md" />
                        <span className="drop-shadow-md">تسجيل الدخول</span>
                      </button>
                    </form>
                  </motion.div>
                </div>
              ) : reportsView === 'menu' ? (
                <div className="space-y-6 pb-6">
                  <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 mb-6 px-2">لوحة الإدارة</h2>
                  
                  <div className="grid grid-cols-2 gap-4">
                     <button 
                       onClick={() => setReportsView('shifts')}
                       className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-[0_8px_20px_-6px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_20px_-6px_rgba(0,0,0,0.3)] border border-slate-100/60 dark:border-slate-800 flex flex-col items-center justify-center gap-4 active:scale-95 transition-transform"
                     >
                       <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-900/40 flex items-center justify-center text-blue-500 shadow-inner">
                         <Clock className="w-8 h-8" />
                       </div>
                       <span className="font-bold text-slate-800 dark:text-slate-100">نظام الشفتات</span>
                     </button>
                     
                     <button 
                       onClick={() => setReportsView('inventory_settings')}
                       className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-[0_8px_20px_-6px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_20px_-6px_rgba(0,0,0,0.3)] border border-slate-100/60 dark:border-slate-800 flex flex-col items-center justify-center gap-4 active:scale-95 transition-transform"
                     >
                       <div className="w-16 h-16 rounded-full bg-cyan-50 dark:bg-cyan-900/40 flex items-center justify-center text-cyan-500 shadow-inner">
                         <Archive className="w-8 h-8" />
                       </div>
                       <span className="font-bold text-slate-800 dark:text-slate-100">إعدادات المخزون</span>
                     </button>

                     <button 
                       onClick={() => setReportsView('delegates_settings')}
                       className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-[0_8px_20px_-6px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_20px_-6px_rgba(0,0,0,0.3)] border border-slate-100/60 dark:border-slate-800 flex flex-col items-center justify-center gap-4 active:scale-95 transition-transform"
                     >
                       <div className="w-16 h-16 rounded-full bg-purple-50 dark:bg-purple-900/40 flex items-center justify-center text-purple-500 shadow-inner">
                         <Users className="w-8 h-8" />
                       </div>
                       <span className="font-bold text-slate-800 dark:text-slate-100">إدارة المندوبين</span>
                     </button>
                     <button 
                       onClick={() => setReportsView('financial')}
                       className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-[0_8px_20px_-6px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_20px_-6px_rgba(0,0,0,0.3)] border border-slate-100/60 dark:border-slate-800 flex flex-col items-center justify-center gap-4 active:scale-95 transition-transform"
                     >
                       <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-500 shadow-inner">
                         <DollarSign className="w-8 h-8" />
                       </div>
                       <span className="font-bold text-slate-800 dark:text-slate-100">المالية والأرباح</span>
                     </button>
                     
                     <button 
                       onClick={() => setReportsView('delegate_stats')}
                       className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-[0_8px_20px_-6px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_20px_-6px_rgba(0,0,0,0.3)] border border-slate-100/60 dark:border-slate-800 flex flex-col items-center justify-center gap-4 active:scale-95 transition-transform col-span-2"
                     >
                       <div className="w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-500 shadow-inner">
                         <PieChart className="w-8 h-8" />
                       </div>
                       <span className="font-bold text-slate-800 dark:text-slate-100">إحصائيات المبيعات</span>
                     </button>
                     
                     <button 
                       onClick={() => setReportsView('change_pin')}
                       className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-[0_8px_20px_-6px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_20px_-6px_rgba(0,0,0,0.3)] border border-slate-100/60 dark:border-slate-800 flex flex-col items-center justify-center gap-4 active:scale-95 transition-transform col-span-2"
                     >
                       <div className="w-16 h-16 rounded-full bg-orange-50 dark:bg-orange-900/40 flex items-center justify-center text-orange-500 shadow-inner">
                         <Lock className="w-8 h-8" />
                       </div>
                       <span className="font-bold text-slate-800 dark:text-slate-100">تغيير رمز الدخول</span>
                     </button>
                  </div>
                </div>
              ) : reportsView === 'change_pin' ? (
                <div className="space-y-6 pb-6">
                  <div className="flex items-center gap-3 mb-6">
                    <button 
                      onClick={() => setReportsView('menu')}
                      className="p-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 active:scale-95 transition-all"
                    >
                      <ChevronLeft className="w-5 h-5 rotate-180" />
                    </button>
                    <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                      <Lock className="w-6 h-6 text-orange-500" />
                      تغيير رمز الدخول
                    </h2>
                  </div>

                  <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
                    <form onSubmit={handleChangePin} className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-slate-600 dark:text-slate-400 mb-1.5 px-1">الرمز الحالي</label>
                        <input 
                          type="password"
                          inputMode="numeric"
                          required
                          value={changePinData.currentPin}
                          onChange={(e) => setChangePinData({...changePinData, currentPin: e.target.value})}
                          placeholder="••••"
                          className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-xl px-4 py-3 text-center tracking-[0.5em] text-slate-800 dark:text-slate-100 focus:border-orange-500 focus:outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-600 dark:text-slate-400 mb-1.5 px-1">الرمز الجديد</label>
                        <input 
                          type="password"
                          inputMode="numeric"
                          required
                          value={changePinData.newPin}
                          onChange={(e) => setChangePinData({...changePinData, newPin: e.target.value})}
                          placeholder="••••"
                          className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-xl px-4 py-3 text-center tracking-[0.5em] text-slate-800 dark:text-slate-100 focus:border-orange-500 focus:outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-600 dark:text-slate-400 mb-1.5 px-1">تأكيد الرمز الجديد</label>
                        <input 
                          type="password"
                          inputMode="numeric"
                          required
                          value={changePinData.confirmPin}
                          onChange={(e) => setChangePinData({...changePinData, confirmPin: e.target.value})}
                          placeholder="••••"
                          className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-xl px-4 py-3 text-center tracking-[0.5em] text-slate-800 dark:text-slate-100 focus:border-orange-500 focus:outline-none transition-colors"
                        />
                      </div>
                      
                      <button 
                        type="submit"
                        className="w-full mt-4 flex items-center justify-center gap-2 py-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg active:scale-95 transition-all shadow-md shadow-orange-500/20"
                      >
                        <Save className="w-5 h-5" />
                        حفظ الرمز الجديد
                      </button>
                    </form>
                  </div>
                </div>
              ) : reportsView === 'delegates_settings' ? (
                <div className="space-y-6 pb-6">
                  {viewedDelegateId ? (
                    <div>
                      <div className="flex items-center gap-3 mb-6">
                        <button 
                          onClick={() => setViewedDelegateId(null)}
                          className="p-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 active:scale-95 transition-all"
                        >
                          <ChevronLeft className="w-5 h-5 rotate-180" />
                        </button>
                        <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                          <ShoppingCart className="w-6 h-6 text-blue-500" />
                          فواتير {delegates.find(d => d.id === viewedDelegateId)?.name}
                        </h2>
                      </div>
                      <div className="space-y-4">
                        {invoices.filter(inv => inv.delegateId === viewedDelegateId).length === 0 ? (
                          <p className="text-center py-8 text-slate-400 dark:text-slate-500 font-medium bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">لا توجد فواتير مسجلة</p>
                        ) : (
                          invoices.filter(inv => inv.delegateId === viewedDelegateId).map(invoice => (
                            <div key={invoice.id} className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-800">
                              <div className="flex justify-between items-center mb-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                                <div>
                                  <div className="text-sm font-bold text-slate-800 dark:text-slate-100">{invoice.id}</div>
                                  <div className="text-xs text-slate-500">{new Date(invoice.date).toLocaleString('ar-IQ')}</div>
                                </div>
                                <button 
                                  onClick={() => setInvoiceReceipt(invoice)}
                                  className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold rounded-lg text-sm active:scale-95 transition-all"
                                >
                                  عرض
                                </button>
                              </div>
                              <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-600 dark:text-slate-400">إجمالي السلع: {invoice.items.reduce((sum, item) => sum + item.quantity, 0)}</span>
                                <span className="font-bold text-emerald-500">{invoice.totalAmount.toLocaleString()} د.ع</span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => setReportsView('menu')}
                            className="p-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 active:scale-95 transition-all"
                          >
                            <ChevronLeft className="w-5 h-5 rotate-180" />
                          </button>
                          <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                            <Users className="w-6 h-6 text-purple-500" />
                            إدارة المندوبين
                          </h2>
                        </div>
                        <button 
                          onClick={() => setDelegateModal({ isOpen: true, id: '', name: '', whatsapp: '' })}
                          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-bold text-sm shadow-md active:scale-95 transition-all flex items-center gap-2"
                        >
                          <UserPlus className="w-4 h-4" />
                          إضافة مندوب
                        </button>
                      </div>
                      
                      {delegates.length === 0 ? (
                        <div className="text-center py-12 text-slate-400 dark:text-slate-500 font-medium bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                          لا يوجد مندوبين حالياً
                        </div>
                      ) : (
                        <div className="grid gap-4">
                          {delegates.map((del) => (
                            <div key={del.id} className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col gap-4">
                              <div className="flex justify-between items-center">
                                <div>
                                  <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg mb-1">{del.name}</h3>
                                  <a href={`https://wa.me/${del.whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm font-semibold text-emerald-500 dark:text-emerald-400 hover:text-emerald-600 transition-colors">
                                    <Phone className="w-4 h-4" />
                                    <span dir="ltr">{del.whatsapp}</span>
                                  </a>
                                </div>
                                <div className="flex gap-2">
                                  <button 
                                    onClick={() => setDelegateModal({ isOpen: true, id: del.id, name: del.name, whatsapp: del.whatsapp })}
                                    className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-blue-50 hover:text-blue-500 transition-colors active:scale-95"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteDelegate(del.id)}
                                    className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-red-50 hover:text-red-500 transition-colors active:scale-95"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                                <button 
                                  onClick={() => setViewedDelegateId(del.id)}
                                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-bold text-sm active:scale-95 transition-all"
                                >
                                  <ShoppingCart className="w-4 h-4" />
                                  عرض الفواتير والمبيعات
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              ) : reportsView === 'shifts' ? (
                <div className="space-y-6 pb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <button 
                      onClick={() => setReportsView('menu')}
                      className="p-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 active:scale-95 transition-all"
                    >
                      <ChevronLeft className="w-5 h-5 rotate-180" />
                    </button>
                    <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                      <Clock className="w-6 h-6 text-blue-500" />
                      إحصائيات الشفتات
                    </h2>
                  </div>
                  
                  <div className="grid gap-4">
                    {shifts.map((shiftName, index) => {
                      const shiftTotal = transactions
                        .filter(t => t.shift === shiftName)
                        .reduce((sum, t) => sum + t.addedQuantity, 0);

                      return (
                        <div 
                          key={index} 
                          onClick={() => { setSelectedShift(shiftName); setReportsView('shift_details'); }}
                          className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-[0_8px_20px_-6px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_20px_-6px_rgba(0,0,0,0.3)] border border-slate-100/60 dark:border-slate-800 relative overflow-hidden flex items-center justify-between cursor-pointer hover:shadow-md transition-shadow active:scale-[0.98]"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/40 flex items-center justify-center text-blue-500">
                              <Clock className="w-6 h-6" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{shiftName}</h3>
                                <button 
                                  onClick={(e) => { 
                                    e.stopPropagation(); 
                                    setEditShiftModal({ isOpen: true, index, oldName: shiftName, newName: shiftName }); 
                                  }}
                                  className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-400 hover:text-blue-500 transition-colors"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold">إجمالي الإنتاج المضاف</p>
                            </div>
                          </div>
                          <div className="bg-gradient-to-r from-emerald-500 to-teal-400 text-white px-4 py-2 rounded-2xl font-extrabold text-xl shadow-md">
                            {shiftTotal}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <h2 className="text-lg font-bold text-slate-700 dark:text-slate-300 mt-8 mb-4 px-2">سجل عمليات الإضافة</h2>
                  
                  {transactions.length === 0 ? (
                    <div className="text-center py-8 text-slate-400 dark:text-slate-500 font-medium">لا توجد عمليات مسجلة بعد</div>
                  ) : (
                    <div className="space-y-3">
                      {transactions.map(t => (
                        <div key={t.id} className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 flex justify-between items-center">
                          <div>
                            <div className="font-bold text-slate-800 dark:text-slate-100 text-sm mb-1">{t.itemName}</div>
                            <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                              <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">{t.shift}</span>
                              <span>{new Date(t.date).toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                          </div>
                          <div className="text-emerald-500 font-extrabold text-lg flex items-center gap-1">
                            <Plus className="w-4 h-4" />
                            {t.addedQuantity}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : reportsView === 'shift_details' ? (
                <div className="space-y-6 pb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <button 
                      onClick={() => setReportsView('shifts')}
                      className="p-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 active:scale-95 transition-all"
                    >
                      <ChevronLeft className="w-5 h-5 rotate-180" />
                    </button>
                    <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                      <Clock className="w-6 h-6 text-blue-500" />
                      إحصائيات {selectedShift} (آخر 30 يوم)
                    </h2>
                  </div>

                  {(() => {
                    const thirtyDaysAgo = new Date();
                    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                    
                    const recentShiftTransactions = transactions.filter(t => 
                      t.shift === selectedShift && new Date(t.date) >= thirtyDaysAgo
                    );
                    
                    const shiftTotal = recentShiftTransactions.reduce((sum, t) => sum + t.addedQuantity, 0);

                    return (
                      <>
                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-[0_8px_20px_-6px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_20px_-6px_rgba(0,0,0,0.3)] border border-slate-100/60 dark:border-slate-800 text-center">
                          <p className="text-sm text-slate-500 dark:text-slate-400 font-bold mb-2">إجمالي الإنتاج المضاف ({selectedShift})</p>
                          <div className="text-4xl font-black text-emerald-500">{shiftTotal}</div>
                        </div>

                        <h2 className="text-lg font-bold text-slate-700 dark:text-slate-300 mt-8 mb-4 px-2">العمليات المسجلة للمخزون</h2>
                        
                        {recentShiftTransactions.length === 0 ? (
                          <div className="text-center py-8 text-slate-400 dark:text-slate-500 font-medium">لا توجد عمليات مسجلة في آخر 30 يوم</div>
                        ) : (
                          <div className="space-y-3">
                            {recentShiftTransactions.map(t => (
                              <div key={t.id} className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 flex justify-between items-center">
                                <div>
                                  <div className="font-bold text-slate-800 dark:text-slate-100 text-sm mb-1">{t.itemName}</div>
                                  <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                                    <span>{new Date(t.date).toLocaleDateString('ar-IQ')}</span>
                                    <span>{new Date(t.date).toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit' })}</span>
                                  </div>
                                </div>
                                <div className="text-emerald-500 font-extrabold text-lg flex items-center gap-1">
                                  <Plus className="w-4 h-4" />
                                  {t.addedQuantity}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              ) : reportsView === 'inventory_settings' ? (
                <div className="space-y-6 pb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <button 
                      onClick={() => setReportsView('menu')}
                      className="p-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 active:scale-95 transition-all"
                    >
                      <ChevronLeft className="w-5 h-5 rotate-180" />
                    </button>
                    <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                      <Archive className="w-6 h-6 text-cyan-500" />
                      إعدادات المخزون
                    </h2>
                  </div>

                  <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 relative overflow-hidden">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6">إضافة عنصر جديد</h3>
                    <form onSubmit={handleAddItem} className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-slate-600 dark:text-slate-400 mb-1.5 px-1 transition-colors duration-300">اسم الايتم</label>
                        <input 
                          type="text" 
                          required
                          value={newItem.name}
                          onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                          className="w-full bg-slate-50 dark:bg-slate-950 rounded-2xl px-4 py-3 text-slate-800 dark:text-slate-100 shadow-inner border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-cyan-400/50 outline-none transition-all placeholder-slate-400 dark:placeholder-slate-600"
                          placeholder="مثال: قالب ثلج"
                        />
                      </div>
                      
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <label className="block text-sm font-bold text-slate-600 dark:text-slate-400 mb-1.5 px-1 transition-colors duration-300">سعر الشراء</label>
                          <div className="relative">
                            <input 
                              type="number" 
                              required
                              value={newItem.purchasePrice}
                              onChange={(e) => setNewItem({...newItem, purchasePrice: e.target.value})}
                              className="w-full bg-slate-50 dark:bg-slate-950 rounded-2xl pl-10 pr-4 py-3 text-slate-800 dark:text-slate-100 shadow-inner border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-cyan-400/50 outline-none transition-all placeholder-slate-400 dark:placeholder-slate-600"
                              placeholder="0"
                            />
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">د.ع</div>
                          </div>
                        </div>
                        
                        <div className="flex-1">
                          <label className="block text-sm font-bold text-slate-600 dark:text-slate-400 mb-1.5 px-1 transition-colors duration-300">سعر البيع</label>
                          <div className="relative">
                            <input 
                              type="number" 
                              required
                              value={newItem.sellPrice}
                              onChange={(e) => setNewItem({...newItem, sellPrice: e.target.value})}
                              className="w-full bg-slate-50 dark:bg-slate-950 rounded-2xl pl-10 pr-4 py-3 text-slate-800 dark:text-slate-100 shadow-inner border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-cyan-400/50 outline-none transition-all placeholder-slate-400 dark:placeholder-slate-600"
                              placeholder="0"
                            />
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">د.ع</div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-slate-600 dark:text-slate-400 mb-1.5 px-1 transition-colors duration-300">الكمية الافتتاحية</label>
                        <div className="relative">
                          <input 
                            type="number" 
                            required
                            value={newItem.quantity}
                            onChange={(e) => setNewItem({...newItem, quantity: e.target.value})}
                            className="w-full bg-slate-50 dark:bg-slate-950 rounded-2xl pl-10 pr-4 py-3 text-slate-800 dark:text-slate-100 shadow-inner border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-cyan-400/50 outline-none transition-all placeholder-slate-400 dark:placeholder-slate-600"
                            placeholder="0"
                          />
                          <Package className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        </div>
                      </div>

                      <div className="pt-4">
                        <button 
                          type="submit"
                          className="w-full rounded-2xl py-4 bg-gradient-to-r from-cyan-600 to-blue-500 text-white font-bold text-lg shadow-3d-button active:shadow-3d-button-active active:translate-y-px transition-all flex justify-center items-center gap-2"
                        >
                          <Plus className="w-5 h-5 drop-shadow-md" />
                          <span className="drop-shadow-md">حفظ وإضافة للمخزون</span>
                        </button>
                      </div>
                    </form>
                  </div>

                  {items.length > 0 && (
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 relative overflow-hidden">
                      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
                        <Archive className="w-5 h-5 text-cyan-500" />
                        العناصر المخزونة الحالية
                      </h3>
                      <div className="space-y-3">
                        {items.map(item => (
                          <div key={item.id} className="bg-slate-50 dark:bg-slate-950 rounded-2xl p-4 shadow-inner border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                            <div>
                              <div className="font-bold text-slate-800 dark:text-slate-100 mb-1">{item.name}</div>
                              <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                                <span>شراء: {item.purchasePrice}</span>
                                <span>بيع: {item.sellPrice}</span>
                              </div>
                            </div>
                            <button 
                              onClick={() => setEditItemModal({ isOpen: true, id: item.id, name: item.name, purchasePrice: item.purchasePrice, sellPrice: item.sellPrice })}
                              className="p-2.5 bg-white dark:bg-slate-800 rounded-xl text-blue-500 shadow-sm border border-slate-100 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-slate-700 active:scale-95 transition-all flex items-center gap-2"
                            >
                              <Edit2 className="w-4 h-4" />
                              <span className="text-sm font-bold">تعديل</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : reportsView === 'financial' ? (
                <div className="space-y-6 pb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => setReportsView('menu')}
                        className="p-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 active:scale-95 transition-all"
                      >
                        <ChevronLeft className="w-5 h-5 rotate-180" />
                      </button>
                      <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        <DollarSign className="w-6 h-6 text-emerald-500" />
                        المالية والأرباح
                      </h2>
                    </div>
                    <button 
                      onClick={() => setExpenseModal({ isOpen: true, description: '', amount: '' })}
                      className="px-4 py-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl font-bold text-sm active:scale-95 transition-all flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      إضافة مصروف
                    </button>
                  </div>

                  {(() => {
                    const now = new Date();
                    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
                    const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay()).getTime();
                    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

                    let soldToday = 0;
                    let soldWeek = 0;
                    let soldMonth = 0;

                    invoices.forEach(inv => {
                      const invDate = new Date(inv.date).getTime();
                      const itemsCount = inv.items.reduce((sum, item) => sum + item.quantity, 0);
                      
                      if (invDate >= startOfDay) soldToday += itemsCount;
                      if (invDate >= startOfWeek) soldWeek += itemsCount;
                      if (invDate >= startOfMonth) soldMonth += itemsCount;
                    });

                    const totalRevenue = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
                    const totalCost = invoices.reduce((sum, inv) => {
                      return sum + inv.items.reduce((itemSum, item) => itemSum + ((item.purchasePrice || 0) * item.quantity), 0);
                    }, 0);
                    
                    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
                    
                    // الصندوق الكلي (Total Cash Box)
                    const totalBox = totalRevenue - totalExpenses;
                    // صافي الأرباح (Net Profit)
                    const totalProfit = totalRevenue - totalCost - totalExpenses;
                    const itemsSold = invoices.reduce((sum, inv) => sum + inv.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0);

                    return (
                      <div className="space-y-6">
                        {/* Overall Financials */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-5 shadow-md flex flex-col items-center justify-center gap-2 text-center col-span-2 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full -z-10"></div>
                            <span className="text-emerald-50 font-bold text-sm">صافي الأرباح الكلي</span>
                            <span className="text-3xl font-extrabold text-white">
                              {totalProfit.toLocaleString()} <span className="text-sm">د.ع</span>
                            </span>
                          </div>
                          
                          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center gap-2 text-center">
                            <span className="text-slate-500 dark:text-slate-400 font-bold text-sm">الصندوق الكلي</span>
                            <span className="text-xl font-bold text-blue-500 dark:text-blue-400">
                              {totalBox.toLocaleString()}
                            </span>
                          </div>

                          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center gap-2 text-center">
                            <span className="text-slate-500 dark:text-slate-400 font-bold text-sm">إجمالي الإيرادات</span>
                            <span className="text-xl font-bold text-indigo-500 dark:text-indigo-400">
                              {totalRevenue.toLocaleString()}
                            </span>
                          </div>

                          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center gap-2 text-center">
                            <span className="text-slate-500 dark:text-slate-400 font-bold text-sm">تكلفة البضاعة</span>
                            <span className="text-xl font-bold text-orange-500 dark:text-orange-400">
                              {totalCost.toLocaleString()}
                            </span>
                          </div>

                          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center gap-2 text-center">
                            <span className="text-slate-500 dark:text-slate-400 font-bold text-sm">إجمالي المصاريف</span>
                            <span className="text-xl font-bold text-red-500 dark:text-red-400">
                              {totalExpenses.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        {/* Expenses List */}
                        {expenses.length > 0 && (
                          <div>
                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-3 px-2">المصاريف المسجلة</h3>
                            <div className="space-y-3">
                              {expenses.slice(0, 10).map(exp => (
                                <div key={exp.id} className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 flex justify-between items-center">
                                  <div>
                                    <div className="font-bold text-slate-800 dark:text-slate-100">{exp.description}</div>
                                    <div className="text-xs text-slate-500">{new Date(exp.date).toLocaleDateString('ar-IQ')}</div>
                                  </div>
                                  <div className="font-bold text-red-500 text-sm">
                                    - {exp.amount.toLocaleString()} د.ع
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                      </div>
                    );
                  })()}
                </div>
              ) : reportsView === 'delegate_stats' ? (
                <div className="space-y-6 pb-6">
                  <div className="flex items-center gap-3 mb-6">
                    <button 
                      onClick={() => setReportsView('menu')}
                      className="p-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 active:scale-95 transition-all"
                    >
                      <ChevronLeft className="w-5 h-5 rotate-180" />
                    </button>
                    <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                      <PieChart className="w-6 h-6 text-indigo-500" />
                      إحصائيات المبيعات
                    </h2>
                  </div>

                  <div className="grid gap-3">
                    {delegates.length === 0 ? (
                      <div className="text-center text-slate-500 py-8">لا يوجد مندوبين مسجلين</div>
                    ) : (
                      delegates.map(delegate => (
                        <button
                          key={delegate.id}
                          onClick={() => {
                            setStatsDelegateId(delegate.id);
                            setReportsView('delegate_stats_detail');
                          }}
                          className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-between hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors text-right"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-500">
                              <TrendingUp className="w-6 h-6" />
                            </div>
                            <div>
                              <div className="font-bold text-slate-800 dark:text-slate-100">{delegate.name}</div>
                              <div className="text-sm text-slate-500">عرض مبيعات المندوب</div>
                            </div>
                          </div>
                          <ChevronLeft className="w-5 h-5 text-slate-400" />
                        </button>
                      ))
                    )}
                  </div>
                </div>
              ) : reportsView === 'delegate_stats_detail' ? (
                <div className="space-y-6 pb-6">
                  {(() => {
                    const delegate = delegates.find(d => d.id === statsDelegateId);
                    if (!delegate) return null;

                    const now = new Date();
                    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
                    const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay()).getTime();
                    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
                    const startOfYear = new Date(now.getFullYear(), 0, 1).getTime();

                    const delegateInvoices = invoices.filter(inv => inv.delegateId === delegate.id);
                    
                    let filteredInvoices = delegateInvoices;
                    if (statsPeriod === 'today') {
                      filteredInvoices = delegateInvoices.filter(inv => new Date(inv.date).getTime() >= startOfDay);
                    } else if (statsPeriod === 'week') {
                      filteredInvoices = delegateInvoices.filter(inv => new Date(inv.date).getTime() >= startOfWeek);
                    } else if (statsPeriod === 'month') {
                      filteredInvoices = delegateInvoices.filter(inv => new Date(inv.date).getTime() >= startOfMonth);
                    } else if (statsPeriod === 'year') {
                      filteredInvoices = delegateInvoices.filter(inv => new Date(inv.date).getTime() >= startOfYear);
                    }

                    // Calculate items sold in this period
                    const salesByItemId: Record<string, {quantity: number, total: number}> = {};
                    let totalItemsQuantity = 0;
                    let totalItemsValue = 0;

                    filteredInvoices.forEach(inv => {
                      inv.items.forEach(cartItem => {
                        const id = cartItem.itemId;
                        if (!salesByItemId[id]) {
                          salesByItemId[id] = { quantity: 0, total: 0 };
                        }
                        salesByItemId[id].quantity += cartItem.quantity;
                        salesByItemId[id].total += cartItem.quantity * (cartItem.sellPrice || 0);
                        totalItemsQuantity += cartItem.quantity;
                        totalItemsValue += cartItem.quantity * (cartItem.sellPrice || 0);
                      });
                    });

                    // Map all inventory items
                    const statsArray = items.map(invItem => {
                      const sales = salesByItemId[invItem.id] || { quantity: 0, total: 0 };
                      return {
                        name: invItem.name,
                        quantity: sales.quantity,
                        total: sales.total
                      };
                    });

                    return (
                      <div>
                        <div className="flex items-center gap-3 mb-6">
                          <button 
                            onClick={() => setReportsView('delegate_stats')}
                            className="p-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 active:scale-95 transition-all"
                          >
                            <ChevronLeft className="w-5 h-5 rotate-180" />
                          </button>
                          <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                            <TrendingUp className="w-6 h-6 text-indigo-500" />
                            {delegate.name}
                          </h2>
                        </div>

                        {/* Period Tabs */}
                        <div className="flex bg-slate-100 dark:bg-slate-800 rounded-2xl p-1 mb-6 overflow-x-auto hide-scrollbar">
                          <button 
                            onClick={() => setStatsPeriod('today')}
                            className={`flex-1 min-w-[70px] py-2 text-xs md:text-sm font-bold rounded-xl transition-all ${statsPeriod === 'today' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                          >
                            اليوم
                          </button>
                          <button 
                            onClick={() => setStatsPeriod('week')}
                            className={`flex-1 min-w-[80px] py-2 text-xs md:text-sm font-bold rounded-xl transition-all ${statsPeriod === 'week' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                          >
                            الأسبوع
                          </button>
                          <button 
                            onClick={() => setStatsPeriod('month')}
                            className={`flex-1 min-w-[80px] py-2 text-xs md:text-sm font-bold rounded-xl transition-all ${statsPeriod === 'month' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                          >
                            الشهر
                          </button>
                          <button 
                            onClick={() => setStatsPeriod('year')}
                            className={`flex-1 min-w-[70px] py-2 text-xs md:text-sm font-bold rounded-xl transition-all ${statsPeriod === 'year' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                          >
                            سنوي
                          </button>
                        </div>

                        {/* Summary Card */}
                        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl p-6 shadow-md text-white flex justify-between items-center mb-6">
                          <div>
                            <div className="text-indigo-100 text-sm font-bold mb-1">إجمالي القطع المباعة</div>
                            <div className="text-3xl font-black">{totalItemsQuantity} <span className="text-base font-normal opacity-80">قطعة</span></div>
                          </div>
                          <div className="text-left">
                            <div className="text-indigo-100 text-sm font-bold mb-1">المبلغ الإجمالي</div>
                            <div className="text-xl font-bold">{totalItemsValue.toLocaleString()} د.ع</div>
                          </div>
                        </div>

                        {/* Items Sold */}
                        <div>
                          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 px-2">تفاصيل المبيعات</h3>
                          {statsArray.length === 0 ? (
                            <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 text-center text-slate-500 shadow-sm border border-slate-100 dark:border-slate-800">
                              لم يتم تسجيل مبيعات في هذه الفترة
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {statsArray.map((stat, idx) => (
                                <div key={idx} className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 flex justify-between items-center">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 font-bold">
                                      {stat.quantity}
                                    </div>
                                    <div className="font-bold text-slate-800 dark:text-slate-100 text-base">{stat.name}</div>
                                  </div>
                                  <div className="font-bold text-slate-600 dark:text-slate-400 text-sm">
                                    {stat.total.toLocaleString()} د.ع
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Recent Invoices List */}
                        <div className="mt-8">
                          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 px-2">العمليات الأخيرة</h3>
                          {filteredInvoices.length === 0 ? (
                            <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 text-center text-slate-500 shadow-sm border border-slate-100 dark:border-slate-800">
                              لا توجد عمليات بيع لهذه الفترة
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {filteredInvoices.slice().reverse().map((inv) => (
                                <div key={inv.id} className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800">
                                  <div className="flex justify-between items-center mb-3">
                                    <div>
                                      <div className="text-sm font-semibold text-slate-500">{new Date(inv.date).toLocaleString('ar-IQ', { hour: 'numeric', minute: 'numeric', hour12: true, month: 'short', day: 'numeric' })}</div>
                                      <div className="font-bold text-slate-800 dark:text-slate-100 text-xs mt-0.5">{inv.id}</div>
                                    </div>
                                    <div className="text-left">
                                      <div className="font-black text-indigo-600 dark:text-indigo-400 text-lg">{inv.totalAmount.toLocaleString()} د.ع</div>
                                    </div>
                                  </div>
                                  <div className="flex justify-between items-center border-t border-slate-100 dark:border-slate-800 pt-3">
                                    <div className="text-sm font-bold text-slate-500">{inv.items.reduce((s, i) => s + i.quantity, 0)} قطع مباعة</div>
                                    <button 
                                      onClick={() => setDraftInvoice(JSON.parse(JSON.stringify(inv)))}
                                      className="flex items-center gap-1.5 text-sm font-bold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-4 py-2 rounded-xl hover:bg-orange-100 dark:hover:bg-orange-900/40 transition-colors active:scale-95"
                                    >
                                      <Edit2 className="w-4 h-4" />
                                      تعديل الفاتورة
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                      </div>
                    );
                  })()}
                </div>
              ) : null}
            </motion.div>
          )}

          {activeTab === 'sales' && (
            <motion.div
              key="sales"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full flex flex-col px-4 pb-32"
            >
              <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
                <ShoppingCart className="w-6 h-6 text-blue-500" />
                نظام البيع
              </h2>

              <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-[0_8px_20px_-6px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_20px_-6px_rgba(0,0,0,0.3)] border border-slate-100/60 dark:border-slate-800 mb-6">
                <label className="block text-sm font-bold text-slate-600 dark:text-slate-400 mb-2">اختر المندوب</label>
                {delegates.length === 0 ? (
                  <p className="text-sm text-red-500 font-bold bg-red-50 dark:bg-red-900/20 p-3 rounded-xl">يرجى إضافة مندوبين من قسم المندوبين أولاً.</p>
                ) : (
                  <div className="relative">
                    <select
                      value={salesDelegateId}
                      onChange={(e) => setSalesDelegateId(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 rounded-2xl px-4 py-3 text-slate-800 dark:text-slate-100 shadow-inner border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-blue-400/50 outline-none appearance-none font-bold"
                    >
                      <option value="">-- اختر المندوب --</option>
                      {delegates.map(d => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <ChevronLeft className="w-5 h-5 -rotate-90" />
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-[0_8px_20px_-6px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_20px_-6px_rgba(0,0,0,0.3)] border border-slate-100/60 dark:border-slate-800 mb-6 flex-1 overflow-y-auto">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                  <Archive className="w-5 h-5 text-cyan-500" />
                  السلع المتوفرة
                </h3>
                {items.length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-4">المخزون فارغ</p>
                ) : (
                  <div className="space-y-3">
                    {items.map(item => {
                      const cartItem = salesCart.find(ci => ci.itemId === item.id);
                      return (
                        <div key={item.id} className="bg-slate-50 dark:bg-slate-950 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                          <div>
                            <div className="font-bold text-slate-800 dark:text-slate-100">{item.name}</div>
                            <div className="flex gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
                              <span>السعر: {item.sellPrice}</span>
                              <span className="text-blue-500">متوفر: {item.quantity}</span>
                            </div>
                          </div>
                          
                          {cartItem ? (
                            <div className="flex items-center gap-3 bg-white dark:bg-slate-900 rounded-xl p-1 shadow-inner border border-slate-200 dark:border-slate-700">
                              <button onClick={() => handleUpdateCartQuantity(item.id, 1)} className="w-8 h-8 flex items-center justify-center bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg active:scale-95"><Plus className="w-4 h-4" /></button>
                              <input 
                                type="number"
                                min="1"
                                value={cartItem.quantity}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value);
                                  handleSetCartQuantity(item.id, isNaN(val) ? 0 : val);
                                }}
                                className="font-bold w-12 text-center bg-transparent border-none focus:outline-none focus:ring-0 text-slate-800 dark:text-slate-100 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none p-0 m-0"
                              />
                              <button onClick={() => handleUpdateCartQuantity(item.id, -1)} className="w-8 h-8 flex items-center justify-center bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg active:scale-95"><Minus className="w-4 h-4" /></button>
                            </div>
                          ) : (
                            <button 
                              onClick={() => handleAddToCart(item)}
                              disabled={Number(item.quantity) < 1}
                              className={`px-4 py-2 rounded-xl font-bold text-sm shadow-sm active:scale-95 transition-all ${Number(item.quantity) < 1 ? 'bg-slate-200 dark:bg-slate-800 text-slate-400' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                            >
                              إضافة
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {salesCart.length > 0 && (
                <div className="bg-gradient-to-tr from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-700 rounded-3xl p-5 shadow-xl text-white mb-4 border border-slate-700">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-semibold text-slate-300 text-sm">المجموع الكلي:</span>
                    <span className="text-2xl font-black text-emerald-400">
                      {salesCart.reduce((sum, item) => sum + (item.sellPrice * item.quantity), 0).toLocaleString()} د.ع
                    </span>
                  </div>
                  <button 
                    onClick={handleCheckout}
                    disabled={!salesDelegateId}
                    className={`w-full py-4 rounded-2xl font-bold text-lg shadow-3d-button flex justify-center items-center gap-2 transition-all ${salesDelegateId ? 'bg-gradient-to-r from-blue-500 to-cyan-400 active:scale-95' : 'bg-slate-700 text-slate-500 cursor-not-allowed'}`}
                  >
                    <ShoppingCart className="w-5 h-5 drop-shadow-md" />
                    إتمام البيع
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3 mb-4 px-2">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Settings className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 transition-colors duration-300">
                  الإعدادات
                </h2>
              </div>

              {/* Appearance Settings */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 transition-colors duration-300">
                <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-4 px-1">المظهر العام</h3>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 transition-colors">
                      {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="font-bold text-slate-800 dark:text-slate-100 text-sm">الوضع الليلي</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">تبديل واجهة التطبيق للون الداكن</div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className={`relative w-14 h-8 rounded-full transition-colors duration-300 ${isDarkMode ? 'bg-blue-500' : 'bg-slate-200 dark:bg-slate-700'}`}
                  >
                    <div className={`absolute top-1 bottom-1 w-6 bg-white rounded-full shadow-md transition-transform duration-300 ${isDarkMode ? 'translate-x-1 left-0' : '-translate-x-1 right-0'}`}></div>
                  </button>
                </div>
              </div>

              {/* Company Profile Settings */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 transition-colors duration-300">
                <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-4 px-1">إعدادات الشركة</h3>
                
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    {logoUrl ? (
                      <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden shrink-0">
                        <img src={logoUrl} alt="الشعار الحالي" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-800 shadow-inner flex items-center justify-center text-slate-400 dark:text-slate-500 shrink-0">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                    )}
                    
                    <div className="flex-1">
                      <div className="font-bold text-slate-800 dark:text-slate-100 text-sm mb-2">صورة الشعار</div>
                      <div className="flex gap-2">
                        <label className="flex-1 cursor-pointer bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 py-2 rounded-xl text-center text-xs font-bold transition-colors">
                          <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                          رفع صورة
                        </label>
                        {logoUrl && (
                          <button 
                            onClick={() => { setLogoUrl(null); localStorage.removeItem('nova_logo'); }}
                            className="p-2 bg-red-50 dark:bg-red-900/30 text-red-500 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </motion.div>
          )}

          {activeTab === 'add' && (
            <motion.div
              key="add"
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center justify-center pt-24 pb-12 h-full text-center px-4"
            >
              <div className="w-28 h-28 mb-8 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/40 dark:to-cyan-900/40 shadow-[inset_0_2px_10px_rgba(255,255,255,0.6),_0_15px_30px_-10px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_2px_10px_rgba(255,255,255,0.05),_0_15px_30px_-10px_rgba(0,0,0,0.3)] flex items-center justify-center text-blue-500 relative">
                <div className="absolute inset-0 rounded-full border-4 border-white/50 dark:border-slate-800/50"></div>
                <Clock className="w-12 h-12 drop-shadow-md animate-pulse" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 mb-3 transition-colors duration-300">
                إضافة عنصر
                <br/>
                <span className="text-blue-600 dark:text-blue-400">قريباً.. قيد العمل</span>
              </h2>
              <p className="text-slate-500 dark:text-slate-400 max-w-[280px] leading-relaxed font-semibold transition-colors duration-300">
                هذه الواجهة قيد التطوير والبرمجة حالياً، سيتم إتاحتها في التحديثات القادمة للنظام.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
            {draftInvoice && (
              <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4 sm:p-0">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
                  onClick={() => setDraftInvoice(null)}
                />
                <motion.div
                  initial={{ opacity: 0, y: 100, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 100, scale: 0.95 }}
                  className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg shadow-2xl relative z-10 max-h-[90vh] flex flex-col"
                >
                  <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        <Edit2 className="w-6 h-6 text-orange-500" />
                        تعديل الفاتورة
                      </h2>
                      <div className="text-xs font-bold text-slate-500 mt-1">{draftInvoice.id}</div>
                    </div>
                    <button onClick={() => setDraftInvoice(null)} className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors active:scale-95">
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  
                  <div className="p-6 overflow-y-auto flex-1 space-y-3">
                    {draftInvoice.items.map((item, idx) => (
                      <div key={idx} className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-700 flex justify-between items-center">
                        <div>
                          <div className="font-bold text-slate-800 dark:text-slate-100">{item.name}</div>
                          <div className="text-xs text-slate-500 mt-0.5">{item.sellPrice.toLocaleString()} د.ع</div>
                        </div>
                        
                        <div className="flex items-center gap-3 bg-white dark:bg-slate-900 rounded-xl p-1 shadow-sm border border-slate-200 dark:border-slate-700">
                          <button onClick={() => handleDraftUpdateQty(item.itemId, 1)} className="w-8 h-8 flex items-center justify-center bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg active:scale-95 transition-colors"><Plus className="w-4 h-4" /></button>
                          <input 
                            type="number"
                            min="0"
                            value={item.quantity}
                            onChange={(e) => {
                              const val = parseInt(e.target.value);
                              handleDraftSetQty(item.itemId, isNaN(val) ? 0 : val);
                            }}
                            className="font-bold w-12 text-center bg-transparent border-none focus:outline-none focus:ring-0 text-slate-800 dark:text-slate-100 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none p-0 m-0"
                          />
                          <button onClick={() => handleDraftUpdateQty(item.itemId, -1)} className="w-8 h-8 flex items-center justify-center bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg active:scale-95 transition-colors"><Minus className="w-4 h-4" /></button>
                        </div>
                      </div>
                    ))}
                    
                    {/* Add new item to invoice optional dropdown */}
                    <div className="mt-6 border-t border-slate-200 dark:border-slate-700 pt-5">
                       <label className="block text-sm font-bold text-slate-600 dark:text-slate-400 mb-2 px-1">إضافة عنصر آخر للفاتورة:</label>
                       <select 
                         className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 font-bold text-slate-800 dark:text-slate-100 outline-none focus:border-blue-500 transition-colors"
                         onChange={(e) => {
                           if (!e.target.value) return;
                           const selectedInvItem = items.find(i => i.id === e.target.value);
                           if (!selectedInvItem) return;
                           if (draftInvoice.items.some(i => i.itemId === selectedInvItem.id)) {
                              e.target.value = '';
                              return;
                           }
                           
                           setDraftInvoice({
                             ...draftInvoice,
                             items: [...draftInvoice.items, {
                               itemId: selectedInvItem.id,
                               name: selectedInvItem.name,
                               quantity: 1,
                               sellPrice: Number(selectedInvItem.sellPrice),
                               purchasePrice: Number(selectedInvItem.purchasePrice)
                             }]
                           });
                           e.target.value = '';
                         }}
                       >
                         <option value="">اختر منتجاً لإضافته...</option>
                         {items.filter(i => !draftInvoice.items.some(di => di.itemId === i.id)).map(item => (
                           <option key={item.id} value={item.id}>{item.name}</option>
                         ))}
                       </select>
                    </div>

                  </div>
                  
                  <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/20 rounded-b-3xl">
                    <div className="flex justify-between items-center mb-4 px-2">
                      <span className="font-bold text-slate-500">الإجمالي بعد التعديل:</span>
                      <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                        {draftInvoice.items.reduce((sum, i) => sum + (i.quantity * i.sellPrice), 0).toLocaleString()} د.ع
                      </span>
                    </div>
                    <button 
                      onClick={handleSaveInvoiceEdit}
                      className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-lg active:scale-95 transition-all shadow-md shadow-orange-500/20 flex items-center justify-center gap-2"
                    >
                      <Save className="w-5 h-5" />
                      حفظ التعديلات في النظام
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </main>

      {/* Bottom Tab Bar */}
      <div className="fixed bottom-0 left-0 right-0 pb-safe z-40 bg-white/70 dark:bg-slate-950/80 backdrop-blur-xl border-t border-white/50 dark:border-slate-800/50 shadow-[0_-10px_20px_rgba(0,0,0,0.03)] dark:shadow-[0_-10px_20px_rgba(0,0,0,0.2)] px-2 py-2 rounded-t-3xl transition-colors duration-300">
        <div className="flex justify-between items-center max-w-md mx-auto px-2">
          <button 
            onClick={() => setActiveTab('inventory')}
            className={`flex flex-col items-center gap-0.5 p-1.5 transition-all ${activeTab === 'inventory' ? 'text-blue-600 dark:text-blue-400 scale-105' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}
          >
            <div className={`p-1.5 rounded-xl transition-all ${activeTab === 'inventory' ? 'bg-blue-100 dark:bg-blue-900/50 shadow-inner' : ''}`}>
              <Archive className="w-5 h-5" />
            </div>
            <span className="text-[9px] font-bold">المخزون</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('delegates')}
            className={`flex flex-col items-center gap-0.5 p-1.5 transition-all ${activeTab === 'delegates' ? 'text-blue-600 dark:text-blue-400 scale-105' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}
          >
            <div className={`p-1.5 rounded-xl transition-all ${activeTab === 'delegates' ? 'bg-blue-100 dark:bg-blue-900/50 shadow-inner' : ''}`}>
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[9px] font-bold">المندوبين</span>
          </button>

          <div className="relative -mt-6 mx-1">
            <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-900 p-1 shadow-[0_-5px_10px_rgba(0,0,0,0.05)] dark:shadow-[0_-5px_10px_rgba(0,0,0,0.3)] transition-colors duration-300">
              <button 
                onClick={() => setActiveTab('sales')}
                className={`w-full h-full rounded-full ${activeTab === 'sales' ? 'bg-gradient-to-tr from-cyan-500 to-blue-500' : 'bg-gradient-to-tr from-blue-600 to-cyan-400'} text-white shadow-3d-button flex items-center justify-center active:scale-95 transition-transform`}
              >
                <ShoppingCart className="w-5 h-5 drop-shadow-md" />
              </button>
            </div>
            <span className={`block text-center mt-1 text-[9px] font-bold ${activeTab === 'sales' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`}>البيع</span>
          </div>

          <button 
            onClick={() => setActiveTab('reports')}
            className={`flex flex-col items-center gap-0.5 p-1.5 transition-all ${activeTab === 'reports' ? 'text-blue-600 dark:text-blue-400 scale-105' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}
          >
            <div className={`p-1.5 rounded-xl transition-all ${activeTab === 'reports' ? 'bg-blue-100 dark:bg-blue-900/50 shadow-inner' : ''}`}>
              <Lock className="w-5 h-5" />
            </div>
            <span className="text-[9px] font-bold">الادارة</span>
          </button>

          <button 
            onClick={() => setActiveTab('settings')}
            className={`flex flex-col items-center gap-0.5 p-1.5 transition-all ${activeTab === 'settings' ? 'text-blue-600 dark:text-blue-400 scale-105' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}
          >
            <div className={`p-1.5 rounded-xl transition-all ${activeTab === 'settings' ? 'bg-blue-100 dark:bg-blue-900/50 shadow-inner' : ''}`}>
              <Settings className="w-5 h-5" />
            </div>
            <span className="text-[9px] font-bold">الإعدادات</span>
          </button>
        </div>
      </div>

      {/* Add/Edit Delegate Modal */}
      <AnimatePresence>
        {delegateModal.isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDelegateModal({ ...delegateModal, isOpen: false })}
              className="fixed inset-0 bg-slate-900/40 dark:bg-slate-950/70 backdrop-blur-sm z-50 transition-colors duration-300"
            />
            <motion.div 
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-slate-50 dark:bg-slate-900 rounded-t-[2.5rem] shadow-[0_-20px_40px_rgba(0,0,0,0.15)] dark:shadow-[0_-20px_40px_rgba(0,0,0,0.4)] overflow-hidden transition-colors duration-300"
            >
              <div className="p-1 border-b border-white dark:border-slate-800/50 shadow-sm flex justify-center bg-white/50 dark:bg-slate-800/50 transition-colors duration-300">
                <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full my-3 transition-colors duration-300"></div>
              </div>
              
              <div className="px-6 py-6 pb-safe">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 transition-colors duration-300">
                    {delegateModal.id ? 'تعديل بيانات المندوب' : 'إضافة مندوب جديد'}
                  </h2>
                  <button 
                    onClick={() => setDelegateModal({ ...delegateModal, isOpen: false })}
                    className="p-2 bg-slate-200/50 dark:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400 shadow-3d-input active:scale-95 transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSaveDelegate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-600 dark:text-slate-400 mb-1.5 px-1 transition-colors duration-300">اسم المندوب</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        required
                        value={delegateModal.name}
                        onChange={(e) => setDelegateModal({...delegateModal, name: e.target.value})}
                        className="w-full bg-white dark:bg-slate-950 rounded-2xl pl-10 pr-4 py-3 text-slate-800 dark:text-slate-100 shadow-3d-input border-none focus:ring-2 focus:ring-blue-400/50 outline-none transition-all placeholder-slate-300 dark:placeholder-slate-700"
                        placeholder="مثال: أحمد محمد"
                      />
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-slate-600 dark:text-slate-400 mb-1.5 px-1 transition-colors duration-300">رقم الواتساب</label>
                    <div className="relative">
                      <input 
                        type="tel" 
                        required
                        dir="ltr"
                        value={delegateModal.whatsapp}
                        onChange={(e) => setDelegateModal({...delegateModal, whatsapp: e.target.value})}
                        className="w-full text-left bg-white dark:bg-slate-950 rounded-2xl pl-4 pr-10 py-3 text-slate-800 dark:text-slate-100 shadow-3d-input border-none focus:ring-2 focus:ring-emerald-400/50 outline-none transition-all placeholder-slate-300 dark:placeholder-slate-700"
                        placeholder="+964..."
                      />
                      <Phone className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    </div>
                  </div>

                  <div className="pt-4 pb-2">
                    <button 
                      type="submit"
                      className="w-full rounded-2xl py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-lg shadow-3d-button active:scale-95 transition-all flex justify-center items-center gap-2"
                    >
                      <Save className="w-5 h-5 drop-shadow-md" />
                      <span className="drop-shadow-md">حفظ المندوب</span>
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Add Quantity Modal */}
      <AnimatePresence>
        {addQuantityModal.isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAddQuantityModal({ ...addQuantityModal, isOpen: false })}
              className="fixed inset-0 bg-slate-900/40 dark:bg-slate-950/70 backdrop-blur-sm z-50 transition-colors duration-300"
            />
            <motion.div 
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-slate-50 dark:bg-slate-900 rounded-t-[2.5rem] shadow-[0_-20px_40px_rgba(0,0,0,0.15)] dark:shadow-[0_-20px_40px_rgba(0,0,0,0.4)] overflow-hidden transition-colors duration-300"
            >
              <div className="p-1 border-b border-white dark:border-slate-800/50 shadow-sm flex justify-center bg-white/50 dark:bg-slate-800/50 transition-colors duration-300">
                <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full my-3 transition-colors duration-300"></div>
              </div>
              
              <div className="px-6 py-6 pb-safe">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 transition-colors duration-300">إضافة إنتاج جديد</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{addQuantityModal.itemName}</p>
                  </div>
                  <button 
                    onClick={() => setAddQuantityModal({ ...addQuantityModal, isOpen: false })}
                    className="p-2 bg-slate-200/50 dark:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400 shadow-3d-input active:scale-95 transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleAddQuantitySubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-600 dark:text-slate-400 mb-1.5 px-1 transition-colors duration-300">الكمية المضافة</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        required
                        min="1"
                        value={addQuantityModal.addedQuantity}
                        onChange={(e) => setAddQuantityModal({...addQuantityModal, addedQuantity: e.target.value})}
                        className="w-full bg-white dark:bg-slate-950 rounded-2xl pl-10 pr-4 py-3 text-slate-800 dark:text-slate-100 shadow-3d-input border-none focus:ring-2 focus:ring-blue-400/50 outline-none transition-all placeholder-slate-300 dark:placeholder-slate-700 text-left font-bold text-lg"
                        placeholder="0"
                      />
                      <Package className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-600 dark:text-slate-400 mb-1.5 px-1 transition-colors duration-300">اختيار الشفت</label>
                    <div className="relative">
                      <select 
                        value={addQuantityModal.shift}
                        onChange={(e) => setAddQuantityModal({...addQuantityModal, shift: e.target.value})}
                        className="w-full bg-white dark:bg-slate-950 rounded-2xl px-4 py-3 text-slate-800 dark:text-slate-100 shadow-3d-input border-none focus:ring-2 focus:ring-blue-400/50 outline-none transition-all appearance-none font-bold text-base"
                      >
                        {shifts.map((shiftName, index) => (
                          <option key={index} value={shiftName}>{shiftName}</option>
                        ))}
                      </select>
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 pb-2">
                    <button 
                      type="submit"
                      className="w-full rounded-2xl py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-lg shadow-3d-button active:shadow-3d-button-active active:translate-y-px transition-all flex justify-center items-center gap-2"
                    >
                      <Plus className="w-5 h-5 drop-shadow-md" />
                      <span className="drop-shadow-md">إضافة للمخزون</span>
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Edit Shift Modal */}
      <AnimatePresence>
        {editShiftModal.isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditShiftModal({ ...editShiftModal, isOpen: false })}
              className="fixed inset-0 bg-slate-900/40 dark:bg-slate-950/70 backdrop-blur-sm z-50 transition-colors duration-300"
            />
            <motion.div 
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-slate-50 dark:bg-slate-900 rounded-t-[2.5rem] shadow-[0_-20px_40px_rgba(0,0,0,0.15)] dark:shadow-[0_-20px_40px_rgba(0,0,0,0.4)] overflow-hidden transition-colors duration-300"
            >
              <div className="p-1 border-b border-white dark:border-slate-800/50 shadow-sm flex justify-center bg-white/50 dark:bg-slate-800/50 transition-colors duration-300">
                <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full my-3 transition-colors duration-300"></div>
              </div>
              
              <div className="px-6 py-6 pb-safe">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 transition-colors duration-300">تعديل اسم القالب (الشفت)</h2>
                  <button 
                    onClick={() => setEditShiftModal({ ...editShiftModal, isOpen: false })}
                    className="p-2 bg-slate-200/50 dark:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400 shadow-3d-input active:scale-95 transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleEditShiftSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-600 dark:text-slate-400 mb-1.5 px-1 transition-colors duration-300">الاسم الجديد</label>
                    <input 
                      type="text" 
                      required
                      value={editShiftModal.newName}
                      onChange={(e) => setEditShiftModal({...editShiftModal, newName: e.target.value})}
                      className="w-full bg-white dark:bg-slate-950 rounded-2xl px-4 py-3 text-slate-800 dark:text-slate-100 shadow-3d-input border-none focus:ring-2 focus:ring-blue-400/50 outline-none transition-all placeholder-slate-300 dark:placeholder-slate-700"
                      placeholder="اسم جديد"
                    />
                  </div>

                  <div className="pt-4 pb-2">
                    <button 
                      type="submit"
                      className="w-full rounded-2xl py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-lg shadow-3d-button active:shadow-3d-button-active active:translate-y-px transition-all flex justify-center items-center gap-2"
                    >
                      <Save className="w-5 h-5 drop-shadow-md" />
                      <span className="drop-shadow-md">حفظ التعديل</span>
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Edit Item Modal */}
      <AnimatePresence>
        {editItemModal.isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditItemModal({ ...editItemModal, isOpen: false })}
              className="fixed inset-0 bg-slate-900/40 dark:bg-slate-950/70 backdrop-blur-sm z-50 transition-colors duration-300"
            />
            <motion.div 
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-slate-50 dark:bg-slate-900 rounded-t-[2.5rem] shadow-[0_-20px_40px_rgba(0,0,0,0.15)] dark:shadow-[0_-20px_40px_rgba(0,0,0,0.4)] overflow-hidden transition-colors duration-300"
            >
              <div className="p-1 border-b border-white dark:border-slate-800/50 shadow-sm flex justify-center bg-white/50 dark:bg-slate-800/50 transition-colors duration-300">
                <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full my-3 transition-colors duration-300"></div>
              </div>
              
              <div className="px-6 py-6 pb-safe">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 transition-colors duration-300">تعديل بيانات العنصر</h2>
                  <button 
                    onClick={() => setEditItemModal({ ...editItemModal, isOpen: false })}
                    className="p-2 bg-slate-200/50 dark:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400 shadow-3d-input active:scale-95 transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleEditItemSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-600 dark:text-slate-400 mb-1.5 px-1 transition-colors duration-300">اسم الايتم</label>
                    <input 
                      type="text" 
                      required
                      value={editItemModal.name}
                      onChange={(e) => setEditItemModal({...editItemModal, name: e.target.value})}
                      className="w-full bg-white dark:bg-slate-950 rounded-2xl px-4 py-3 text-slate-800 dark:text-slate-100 shadow-3d-input border-none focus:ring-2 focus:ring-blue-400/50 outline-none transition-all placeholder-slate-300 dark:placeholder-slate-700"
                      placeholder="اسم العنصر"
                    />
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-bold text-slate-600 dark:text-slate-400 mb-1.5 px-1 transition-colors duration-300">سعر الشراء</label>
                      <div className="relative">
                        <input 
                          type="number" 
                          required
                          value={editItemModal.purchasePrice}
                          onChange={(e) => setEditItemModal({...editItemModal, purchasePrice: e.target.value})}
                          className="w-full bg-white dark:bg-slate-950 rounded-2xl pl-10 pr-4 py-3 text-slate-800 dark:text-slate-100 shadow-3d-input border-none focus:ring-2 focus:ring-blue-400/50 outline-none transition-all placeholder-slate-300 dark:placeholder-slate-700"
                          placeholder="0"
                        />
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">د.ع</div>
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <label className="block text-sm font-bold text-slate-600 dark:text-slate-400 mb-1.5 px-1 transition-colors duration-300">سعر البيع</label>
                      <div className="relative">
                        <input 
                          type="number" 
                          required
                          value={editItemModal.sellPrice}
                          onChange={(e) => setEditItemModal({...editItemModal, sellPrice: e.target.value})}
                          className="w-full bg-white dark:bg-slate-950 rounded-2xl pl-10 pr-4 py-3 text-slate-800 dark:text-slate-100 shadow-3d-input border-none focus:ring-2 focus:ring-blue-400/50 outline-none transition-all placeholder-slate-300 dark:placeholder-slate-700"
                          placeholder="0"
                        />
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">د.ع</div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 pb-2">
                    <button 
                      type="submit"
                      className="w-full rounded-2xl py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-lg shadow-3d-button active:shadow-3d-button-active active:translate-y-px transition-all flex justify-center items-center gap-2"
                    >
                      <Save className="w-5 h-5 drop-shadow-md" />
                      <span className="drop-shadow-md">حفظ التعديل</span>
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Invoice Receipt Modal (Screenshot Mode) */}
      <AnimatePresence>
        {invoiceReceipt && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed inset-0 z-[100] bg-white flex flex-col overflow-y-auto"
          >
            <div className="flex-1 max-w-lg mx-auto w-full px-6 py-8" dir="rtl">
              <div className="flex justify-between items-center mb-8 print:hidden">
                <button 
                  onClick={() => setInvoiceReceipt(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold active:scale-95"
                >
                  إغلاق
                </button>
                <button 
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-bold active:scale-95 flex items-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  طباعة / حفظ
                </button>
              </div>

              {/* Receipt Content for Screenshot */}
              <div className="bg-white p-6 border-2 border-slate-100 rounded-3xl shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-10 opacity-50"></div>
                
                <div className="text-center mb-8">
                  <div className="w-16 h-16 mx-auto bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 mb-3">
                    <Droplets className="w-8 h-8" />
                  </div>
                  <h1 className="text-2xl font-black text-slate-800">شركة نوڤا</h1>
                  <p className="text-sm font-bold text-slate-500">لإنتاج الثلج البلوري</p>
                </div>

                <div className="space-y-3 mb-8 bg-slate-50 p-4 rounded-2xl">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-bold">رقم القائمة:</span>
                    <span className="font-bold text-slate-800">{invoiceReceipt.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-bold">اسم المندوب:</span>
                    <span className="font-bold text-slate-800">{invoiceReceipt.delegateName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-bold">التاريخ:</span>
                    <span className="font-bold text-slate-800">{new Date(invoiceReceipt.date).toLocaleDateString('ar-IQ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-bold">الوقت:</span>
                    <span className="font-bold text-slate-800">{new Date(invoiceReceipt.date).toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>

                <div className="mb-6">
                  <table className="w-full text-right">
                    <thead>
                      <tr className="border-b-2 border-slate-100">
                        <th className="py-2 text-slate-500 font-bold">السلعة</th>
                        <th className="py-2 text-slate-500 font-bold text-center">الكمية</th>
                        <th className="py-2 text-slate-500 font-bold">السعر</th>
                        <th className="py-2 text-slate-500 font-bold text-left">المجموع</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {invoiceReceipt.items.map((item, i) => (
                        <tr key={i}>
                          <td className="py-3 font-bold text-slate-800">{item.name}</td>
                          <td className="py-3 font-bold text-blue-600 text-center">{item.quantity}</td>
                          <td className="py-3 font-bold text-slate-800">{item.sellPrice.toLocaleString()}</td>
                          <td className="py-3 font-bold text-slate-800 text-left">{(item.sellPrice * item.quantity).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="border-t-2 border-slate-100 pt-4 flex justify-between items-center">
                  <span className="text-lg font-bold text-slate-500">المجموع الكلي</span>
                  <span className="text-2xl font-black text-emerald-500">{invoiceReceipt.totalAmount.toLocaleString()} د.ع</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirm Modal */}
      <AnimatePresence>
        {confirmModal.isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
              className="fixed inset-0 bg-slate-900/40 dark:bg-slate-950/70 backdrop-blur-sm z-[150] transition-colors duration-300"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[150] w-full max-w-sm px-4"
            >
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-100 dark:border-slate-800 text-center">
                <div className="w-16 h-16 mx-auto bg-red-50 dark:bg-red-900/20 text-red-500 rounded-full flex items-center justify-center mb-4">
                  <ShieldAlert className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">تأكيد الإجراء</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-6 font-medium">{confirmModal.message}</p>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                    className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold active:scale-95 transition-all"
                  >
                    إلغاء
                  </button>
                  <button 
                    onClick={confirmModal.onConfirm}
                    className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold active:scale-95 transition-all"
                  >
                    نعم، متأكد
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      
      {/* Expense Modal */}
      <AnimatePresence>
        {expenseModal.isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/40 dark:bg-slate-950/70 backdrop-blur-sm z-[150] transition-colors duration-300"
              onClick={() => setExpenseModal({ isOpen: false, description: '', amount: '' })}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[150] w-full max-w-sm px-4"
            >
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-900/40 flex items-center justify-center text-red-500">
                    <Plus className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">إضافة مصروف</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">وصف المصروف</label>
                    <input 
                      type="text"
                      placeholder="مثال: شراء أكياس، رواتب..."
                      value={expenseModal.description}
                      onChange={(e) => setExpenseModal({ ...expenseModal, description: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-800 dark:text-slate-100 focus:border-red-500 focus:outline-none transition-colors font-medium text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">المبلغ (د.ع)</label>
                    <input 
                      type="number"
                      placeholder="0"
                      value={expenseModal.amount}
                      onChange={(e) => setExpenseModal({ ...expenseModal, amount: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-800 dark:text-slate-100 focus:border-red-500 focus:outline-none transition-colors font-medium text-sm"
                    />
                  </div>

                  <div className="pt-4 flex gap-3">
                    <button 
                      onClick={() => setExpenseModal({ isOpen: false, description: '', amount: '' })}
                      className="flex-1 py-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold active:scale-95 transition-all text-sm"
                    >
                      إلغاء
                    </button>
                    <button 
                      onClick={handleSaveExpense}
                      className="flex-1 py-3.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold active:scale-95 transition-all text-sm shadow-md shadow-red-500/20"
                    >
                      حفظ المصروف
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] flex items-center justify-center pointer-events-none w-full px-4"
          >
            <div className={`px-6 py-4 rounded-2xl shadow-xl border flex items-center gap-3 max-w-sm w-full font-bold text-sm ${
              toast.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-900/90 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50' : 
              toast.type === 'error' ? 'bg-red-50 dark:bg-red-900/90 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800/50' : 
              'bg-blue-50 dark:bg-blue-900/90 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800/50'
            }`}>
              {toast.type === 'success' && <Check className="w-5 h-5 shrink-0" />}
              {toast.type === 'error' && <ShieldAlert className="w-5 h-5 shrink-0" />}
              {toast.type === 'info' && <Settings className="w-5 h-5 shrink-0" />}
              <span className="flex-1">{toast.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
