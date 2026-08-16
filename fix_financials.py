import re

content = open('src/App.tsx').read()

# 1. Add interface
expense_interface = """interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
}

export default function App() {"""
content = content.replace("export default function App() {", expense_interface)

# 2. Add State
state_str = """
  // Expenses State
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [expenseModal, setExpenseModal] = useState({ isOpen: false, description: '', amount: '' });

  // Sales & Invoices State"""
content = content.replace("  // Sales & Invoices State", state_str)

# 3. Add function to handle adding expenses
handle_expense_str = """
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

  const handleAddToCart"""
content = content.replace("  const handleAddToCart", handle_expense_str)

open('src/App.tsx', 'w').write(content)
