import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Moon, Sun, BarChart3, Award, Flame, X, Check, Calendar, Bell, Clock } from 'lucide-react';

export default function HabitTracker() {
  const [habits, setHabits] = useState([]);
  const [userName, setUserName] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);
  const [newHabit, setNewHabit] = useState({ name: '', category: 'Учёба' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [expandedHabit, setExpandedHabit] = useState(null);
  const [editingNotification, setEditingNotification] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const categories = ['Учёба', 'Здоровье', 'Спорт', 'Работа', 'Личное'];
  const categoryIcons = {
    'Учёба': '📚',
    'Здоровье': '🍎',
    'Спорт': '💪',
    'Работа': '💼',
    'Личное': '✨'
  };

  const weekDays = [
    { short: 'ПН', value: 1 },
    { short: 'ВТ', value: 2 },
    { short: 'СР', value: 3 },
    { short: 'ЧТ', value: 4 },
    { short: 'ПТ', value: 5 },
    { short: 'СБ', value: 6 },
    { short: 'ВС', value: 0 }
  ];

  useEffect(() => {
    const savedHabits = localStorage.getItem('habits');
    const savedName = localStorage.getItem('userName');
    if (savedHabits) setHabits(JSON.parse(savedHabits));
    if (savedName) setUserName(savedName);
    else setShowNameInput(true);
  }, []);

  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    if (userName) localStorage.setItem('userName', userName);
  }, [userName]);

  const addHabit = () => {
    if (!newHabit.name.trim()) return;
    
    const habit = {
      id: Date.now(),
      name: newHabit.name,
      category: newHabit.category,
      completedDates: [],
      createdAt: new Date().toISOString(),
      notifications: {
        enabled: false,
        time: '09:00',
        days: [1, 2, 3, 4, 5, 6, 0]
      }
    };
    
    setHabits([...habits, habit]);
    setNewHabit({ name: '', category: 'Учёба' });
    setShowAddForm(false);
  };

  const deleteHabit = (id) => {
    setConfirmDelete(id);
  };

  const updateHabitNotifications = (habitId, notifications) => {
    setHabits(habits.map(habit => 
      habit.id === habitId ? { ...habit, notifications } : habit
    ));
  };

  const toggleNotificationDay = (habitId, dayValue) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    const currentDays = habit.notifications?.days || [];
    const newDays = currentDays.includes(dayValue)
      ? currentDays.filter(d => d !== dayValue)
      : [...currentDays, dayValue];

    updateHabitNotifications(habitId, {
      ...habit.notifications,
      days: newDays
    });
  };

  const toggleCompletion = (habitId, date) => {
    const dateStr = date.toDateString();
    
    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        const completed = habit.completedDates || [];
        const isCompleted = completed.includes(dateStr);
        
        return {
          ...habit,
          completedDates: isCompleted
            ? completed.filter(d => d !== dateStr)
            : [...completed, dateStr]
        };
      }
      return habit;
    }));
  };

  const toggleTodayCompletion = (habitId) => {
    toggleCompletion(habitId, new Date());
  };

  const getCurrentMonthDays = () => {
    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const days = [];
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(now.getFullYear(), now.getMonth(), day));
    }
    return days;
  };

  const isCompletedOnDate = (habit, date) => {
    return (habit.completedDates || []).includes(date.toDateString());
  };

  const isCompletedToday = (habit) => {
    return (habit.completedDates || []).includes(new Date().toDateString());
  };

  const getStreak = (habit) => {
    const dates = [...(habit.completedDates || [])].sort((a, b) => new Date(b) - new Date(a));
    if (dates.length === 0) return 0;
    
    let streak = 0;
    const currentDate = new Date();
    
    for (let i = 0; i < dates.length; i++) {
      const completedDate = new Date(dates[i]);
      const diffDays = Math.floor((currentDate - completedDate) / (1000 * 60 * 60 * 24));
      if (diffDays === streak) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  const getMonthlyCompletion = (habit) => {
    const monthDays = getCurrentMonthDays();
    const today = new Date();
    const daysPassedInMonth = today.getDate();
    const completedInMonth = monthDays.filter(day => day <= today && isCompletedOnDate(habit, day)).length;
    return daysPassedInMonth > 0 ? Math.round((completedInMonth / daysPassedInMonth) * 100) : 0;
  };

  const stats = {
    active: habits.length,
    achievements: habits.filter(h => getStreak(h) >= 7).length,
    maxStreak: Math.max(...habits.map(h => getStreak(h)), 0)
  };

  const motivationalMessages = [
    'Ты сильнее, чем думаешь! 💪',
    'Каждый день - новая возможность! ✨',
    'Маленькие шаги ведут к большим целям! 🎯',
    'Продолжай в том же духе! 🚀',
    'Ты молодец! Продолжай! 🌟'
  ];

  const [currentMessage] = useState(
    motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)]
  );

  const monthDays = getCurrentMonthDays();

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <header className={`${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg sticky top-0 z-50`}>
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {userName ? userName[0].toUpperCase() : 'H'}
              </div>
              <h1 className="text-lg font-bold">Habit Tracker</h1>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setIsDark(!isDark)} className={`p-2 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button className={`p-2 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <BarChart3 className="w-5 h-5" />
              </button>
              <button onClick={() => { localStorage.clear(); setUserName(''); setHabits([]); setShowNameInput(true); }} className="text-sm text-gray-400 hover:text-white px-2">
                Выход
              </button>
            </div>
          </div>
        </div>
      </header>

      {showNameInput && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4">
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 w-full max-w-sm`}>
            <h2 className="text-xl font-bold mb-4">Как вас зовут?</h2>
            <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && userName && setShowNameInput(false)} placeholder="Введите ваше имя" className={`w-full px-4 py-3 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-gray-100'} outline-none text-base`} autoFocus />
            <button onClick={() => userName && setShowNameInput(false)} disabled={!userName} className="w-full mt-4 bg-blue-500 text-white py-3 rounded-xl font-medium disabled:opacity-50">
              Начать
            </button>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4">
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 w-full max-w-sm`}>
            <h2 className="text-xl font-bold mb-2">Удалить привычку?</h2>
            <p className="text-gray-400 mb-6">{habits.find(h => h.id === confirmDelete)?.name}</p>
            <div className="flex gap-3">
              <button onClick={() => { setHabits(habits.filter(h => h.id !== confirmDelete)); setConfirmDelete(null); }} className="flex-1 bg-red-500 text-white py-3 rounded-xl font-medium hover:bg-red-600">
                Удалить
              </button>
              <button onClick={() => setConfirmDelete(null)} className={`flex-1 ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} py-3 rounded-xl font-medium`}>
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-[100]">
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-t-3xl p-6 w-full max-w-lg`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Новая привычка</h3>
              <button onClick={() => setShowAddForm(false)} className="p-2"><X className="w-6 h-6" /></button>
            </div>
            <input type="text" value={newHabit.name} onChange={(e) => setNewHabit({...newHabit, name: e.target.value})} placeholder="Название привычки" className={`w-full px-4 py-3 rounded-xl mb-4 ${isDark ? 'bg-gray-700' : 'bg-gray-100'} outline-none text-base`} autoFocus />
            <select value={newHabit.category} onChange={(e) => setNewHabit({...newHabit, category: e.target.value})} className={`w-full px-4 py-3 rounded-xl mb-4 ${isDark ? 'bg-gray-700' : 'bg-gray-100'} outline-none text-base`}>
              {categories.map(cat => <option key={cat} value={cat}>{categoryIcons[cat]} {cat}</option>)}
            </select>
            <button onClick={addHabit} className="w-full bg-blue-500 text-white py-4 rounded-xl font-medium text-base">
              Создать привычку
            </button>
          </div>
        </div>
      )}

      {editingNotification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-[100]">
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-t-3xl p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">⏰ Напоминания</h3>
              <button onClick={() => setEditingNotification(null)} className="p-2"><X className="w-6 h-6" /></button>
            </div>
            <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-100'} rounded-xl p-4 mb-4`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-blue-500" />
                  <span className="font-medium">Включить уведомления</span>
                </div>
                <button onClick={() => { const habit = habits.find(h => h.id === editingNotification); updateHabitNotifications(editingNotification, { ...habit.notifications, enabled: !habit.notifications.enabled }); }} className={`w-14 h-7 rounded-full transition-all relative flex items-center p-1 ${habits.find(h => h.id === editingNotification)?.notifications?.enabled ? 'bg-blue-500' : 'bg-gray-500'}`}>
                  <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 ${habits.find(h => h.id === editingNotification)?.notifications?.enabled ? 'translate-x-7' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>
            {habits.find(h => h.id === editingNotification)?.notifications?.enabled && (
              <div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4" />Время напоминания
                  </label>
                  <input type="time" value={habits.find(h => h.id === editingNotification)?.notifications?.time || '09:00'} onChange={(e) => { const habit = habits.find(h => h.id === editingNotification); updateHabitNotifications(editingNotification, { ...habit.notifications, time: e.target.value }); }} className={`w-full px-4 py-3 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-gray-100'} outline-none text-base`} />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-3">Дни недели</label>
                  <div className="grid grid-cols-7 gap-2">
                    {weekDays.map(day => {
                      const habit = habits.find(h => h.id === editingNotification);
                      const isSelected = habit?.notifications?.days?.includes(day.value);
                      return (
                        <button key={day.value} onClick={() => toggleNotificationDay(editingNotification, day.value)} className={`aspect-square rounded-xl font-medium text-sm transition-all ${isSelected ? 'bg-blue-500 text-white' : isDark ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-600'}`}>
                          {day.short}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className={`${isDark ? 'bg-blue-900/30' : 'bg-blue-100'} rounded-xl p-4 border-2 border-blue-500/30`}>
                  <p className="text-sm text-gray-400 mb-2">Превью уведомления:</p>
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">🔔</div>
                    <div>
                      <p className="font-medium mb-1">{habits.find(h => h.id === editingNotification)?.name}</p>
                      <p className="text-sm text-gray-400">Пора выполнить привычку! 💪</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <button onClick={() => setEditingNotification(null)} className="w-full mt-4 bg-blue-500 text-white py-3 rounded-xl font-medium">
              Готово
            </button>
          </div>
        </div>
      )}

      <div className="px-4 py-4 pb-24">
        <div className="mb-4">
          <h2 className="text-2xl font-bold mb-1">Добро пожаловать, {userName || 'Друг'}!</h2>
          <p className="text-sm text-gray-400">Отслеживайте свои привычки и достигайте целей</p>
        </div>
        <div className={`${isDark ? 'bg-gradient-to-r from-blue-900 to-purple-900' : 'bg-gradient-to-r from-blue-100 to-purple-100'} rounded-2xl p-4 mb-4 text-center`}>
          <p className="text-base font-medium">{currentMessage}</p>
        </div>
        <div className="grid grid-cols-3 gap-2 mb-6">
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-3`}>
            <div className={`w-10 h-10 rounded-xl ${isDark ? 'bg-blue-900' : 'bg-blue-100'} flex items-center justify-center mb-2 mx-auto`}>
              <BarChart3 className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-gray-400 text-[10px] text-center mb-1 leading-tight">Активных<br/>привычек</p>
            <p className="text-2xl font-bold text-center">{stats.active}</p>
          </div>
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-3`}>
            <div className={`w-10 h-10 rounded-xl ${isDark ? 'bg-yellow-900' : 'bg-yellow-100'} flex items-center justify-center mb-2 mx-auto`}>
              <Award className="w-5 h-5 text-yellow-500" />
            </div>
            <p className="text-gray-400 text-[10px] text-center mb-1 leading-tight">Достижений</p>
            <p className="text-2xl font-bold text-center">{stats.achievements}</p>
          </div>
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-3`}>
            <div className={`w-10 h-10 rounded-xl ${isDark ? 'bg-orange-900' : 'bg-orange-100'} flex items-center justify-center mb-2 mx-auto`}>
              <Flame className="w-5 h-5 text-orange-500" />
            </div>
            <p className="text-gray-400 text-[10px] text-center mb-1 leading-tight">Дней<br/>подряд</p>
            <p className="text-2xl font-bold text-center">{stats.maxStreak}</p>
          </div>
        </div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">Мои привычки</h3>
        </div>
        {habits.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-gray-400 text-lg mb-2">Пока нет привычек</p>
            <p className="text-gray-500 text-sm">Нажмите + чтобы добавить первую</p>
          </div>
        ) : (
          <div className="space-y-3 mb-4">
            {habits.map(habit => {
              const isExpanded = expandedHabit === habit.id;
              const completedToday = isCompletedToday(habit);
              const streak = getStreak(habit);
              const completion = getMonthlyCompletion(habit);
              const notificationsEnabled = habit.notifications?.enabled;
              
              return (
                <div key={habit.id} className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl overflow-hidden`}>
                  <div className="p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="text-3xl">{categoryIcons[habit.category]}</div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-base mb-1">{habit.name}</h4>
                        <div className="flex items-center gap-2">
                          <p className="text-xs text-gray-400">{habit.category}</p>
                          {notificationsEnabled && (
                            <span className="flex items-center gap-1 text-xs text-blue-400">
                              <Bell className="w-3 h-3" />
                              {habit.notifications.time}
                            </span>
                          )}
                        </div>
                      </div>
                      <button onClick={() => deleteHabit(habit.id)} className="text-gray-400 hover:text-red-500 p-2 -m-1 flex-shrink-0">
                        <Trash2 className="w-6 h-6" />
                      </button>
                    </div>
                    <div className="flex items-center gap-4 mb-3 text-sm">
                      <div className="flex items-center gap-1.5">
                        <Flame className="w-4 h-4 text-orange-500" />
                        <span className="text-gray-400">Серия:</span>
                        <span className="font-bold text-orange-500">{streak} дней</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-gray-400">За месяц:</span>
                        <span className="font-bold text-blue-500">{completion}%</span>
                      </div>
                    </div>
                    <div className={`w-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2 mb-4 overflow-hidden`}>
                      <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500" style={{width: `${completion}%`}} />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <button onClick={() => toggleTodayCompletion(habit.id)} className={`col-span-2 py-3 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 ${completedToday ? 'bg-green-500 text-white' : 'bg-blue-500 text-white hover:bg-blue-600'}`}>
                        <Check className="w-5 h-5" />
                        {completedToday ? 'Выполнено' : 'Отметить'}
                      </button>
                      <button onClick={() => setEditingNotification(habit.id)} className={`px-3 py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-1 ${notificationsEnabled ? 'bg-blue-500 text-white' : isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}>
                        <Bell className="w-4 h-4" />
                      </button>
                    </div>
                    <button onClick={() => setExpandedHabit(isExpanded ? null : habit.id)} className={`w-full mt-2 py-2 rounded-xl font-medium text-sm flex items-center justify-center gap-2 ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}>
                      <Calendar className="w-4 h-4" />
                      {isExpanded ? 'Скрыть календарь' : 'Показать календарь'}
                    </button>
                  </div>
                  {isExpanded && (
                    <div className={`border-t ${isDark ? 'border-gray-700' : 'border-gray-200'} p-4`}>
                      <h5 className="text-sm font-medium mb-3 text-gray-400">
                        Календарь на {new Date().toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })}
                      </h5>
                      <div className="grid grid-cols-7 gap-1.5">
                        {monthDays.map((day, idx) => {
                          const isCompleted = isCompletedOnDate(habit, day);
                          const isToday = day.toDateString() === new Date().toDateString();
                          const isPast = day < new Date().setHours(0, 0, 0, 0);
                          const bgColor = isCompleted ? 'bg-green-500 text-white' : isDark ? 'bg-gray-700' : 'bg-gray-200';
                          const ringClass = isToday ? 'ring-2 ring-blue-500' : '';
                          const opacityClass = isPast && !isCompleted && !isToday ? 'opacity-40' : '';
                          
                          return (
                            <button key={idx} onClick={() => toggleCompletion(habit.id, day)} className={`aspect-square rounded-lg flex items-center justify-center text-xs font-medium transition-all ${bgColor} ${ringClass} ${opacityClass}`}>
                              {day.getDate()}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      <button onClick={() => setShowAddForm(true)} className="fixed right-5 bottom-5 w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full shadow-2xl flex items-center justify-center active:scale-95 transition-transform z-40">
        <Plus className="w-7 h-7" />
      </button>
    </div>
  );
}
