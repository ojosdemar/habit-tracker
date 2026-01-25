import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Moon, Sun, BarChart3, Award, Flame } from 'lucide-react';

export default function HabitTracker() {
  const [habits, setHabits] = useState([]);
  const [userName, setUserName] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);
  const [newHabit, setNewHabit] = useState({ name: '', category: 'Учёба' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [isDark, setIsDark] = useState(true);

  const categories = ['Учёба', 'Здоровье', 'Спорт', 'Работа', 'Личное'];
  const categoryIcons = {
    'Учёба': '📚',
    'Здоровье': '🍎',
    'Спорт': '💪',
    'Работа': '💼',
    'Личное': '✨'
  };

  // Загрузка данных
  useEffect(() => {
    const savedHabits = localStorage.getItem('habits');
    const savedName = localStorage.getItem('userName');
    if (savedHabits) setHabits(JSON.parse(savedHabits));
    if (savedName) setUserName(savedName);
    else setShowNameInput(true);
  }, []);

  // Сохранение данных
  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    if (userName) localStorage.setItem('userName', userName);
  }, [userName]);

  // Добавить привычку
  const addHabit = () => {
    if (!newHabit.name.trim()) return;
    
    const habit = {
      id: Date.now(),
      name: newHabit.name,
      category: newHabit.category,
      completedDates: [],
      createdAt: new Date().toISOString()
    };
    
    setHabits([...habits, habit]);
    setNewHabit({ name: '', category: 'Учёба' });
    setShowAddForm(false);
  };

  // Удалить привычку
  const deleteHabit = (id) => {
    setHabits(habits.filter(h => h.id !== id));
  };

  // Отметить выполнение
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

  // Получить текущий месяц
  const getCurrentMonthDays = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    return days;
  };

  // Проверить выполнение в день
  const isCompletedOnDate = (habit, date) => {
    const dateStr = date.toDateString();
    return (habit.completedDates || []).includes(dateStr);
  };

  // Получить серию дней
  const getStreak = (habit) => {
    const dates = [...(habit.completedDates || [])].sort((a, b) => 
      new Date(b) - new Date(a)
    );
    
    if (dates.length === 0) return 0;
    
    let streak = 0;
    let currentDate = new Date();
    
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

  // Процент выполнения за месяц
  const getMonthlyCompletion = (habit) => {
    const monthDays = getCurrentMonthDays();
    const today = new Date();
    const daysPassedInMonth = today.getDate();
    
    const completedInMonth = monthDays.filter(day => 
      day <= today && isCompletedOnDate(habit, day)
    ).length;
    
    return Math.round((completedInMonth / daysPassedInMonth) * 100);
  };

  // Статистика
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
      {/* Header */}
      <header className={`${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                {userName ? userName[0].toUpperCase() : 'H'}
              </div>
              <h1 className="text-2xl font-bold">Habit Tracker</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsDark(!isDark)}
                className={`p-2 rounded-lg ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button
                className={`p-2 rounded-lg ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                <BarChart3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => {
                  localStorage.clear();
                  window.location.reload();
                }}
                className="px-4 py-2 text-sm text-gray-400 hover:text-white"
              >
                Выход
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Name Input Modal */}
      {showNameInput && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl p-8 max-w-md w-full mx-4`}>
            <h2 className="text-2xl font-bold mb-4">Как вас зовут?</h2>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && userName && setShowNameInput(false)}
              placeholder="Введите ваше имя"
              className={`w-full px-4 py-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'} outline-none`}
              autoFocus
            />
            <button
              onClick={() => userName && setShowNameInput(false)}
              disabled={!userName}
              className="w-full mt-4 bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50"
            >
              Начать
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">
            Добро пожаловать, {userName || 'Гость'}!
          </h2>
          <p className="text-gray-400">Отслеживайте свои привычки и достигайте целей</p>
        </div>

        {/* Motivational Message */}
        <div className={`${isDark ? 'bg-gradient-to-r from-blue-900 to-purple-900' : 'bg-gradient-to-r from-blue-100 to-purple-100'} rounded-xl p-6 mb-8 text-center`}>
          <p className="text-xl font-medium">{currentMessage}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 flex items-center gap-4`}>
            <div className={`w-12 h-12 rounded-lg ${isDark ? 'bg-blue-900' : 'bg-blue-100'} flex items-center justify-center`}>
              <BarChart3 className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Активных привычек</p>
              <p className="text-3xl font-bold">{stats.active}</p>
            </div>
          </div>

          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 flex items-center gap-4`}>
            <div className={`w-12 h-12 rounded-lg ${isDark ? 'bg-yellow-900' : 'bg-yellow-100'} flex items-center justify-center`}>
              <Award className="w-6 h-6 text-yellow-500" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Достижений</p>
              <p className="text-3xl font-bold">{stats.achievements}</p>
            </div>
          </div>

          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 flex items-center gap-4`}>
            <div className={`w-12 h-12 rounded-lg ${isDark ? 'bg-orange-900' : 'bg-orange-100'} flex items-center justify-center`}>
              <Flame className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Дней подряд</p>
              <p className="text-3xl font-bold">{stats.maxStreak}</p>
            </div>
          </div>
        </div>

        {/* Habits Section */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold">Мои привычки</h3>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 font-medium"
          >
            <Plus className="w-5 h-5" />
            Новая привычка
          </button>
        </div>

        {/* Add Habit Form */}
        {showAddForm && (
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 mb-6`}>
            <h4 className="font-semibold text-lg mb-4">Добавить привычку</h4>
            <input
              type="text"
              value={newHabit.name}
              onChange={(e) => setNewHabit({...newHabit, name: e.target.value})}
              placeholder="Название привычки"
              className={`w-full px-4 py-3 rounded-lg mb-4 ${isDark ? 'bg-gray-700' : 'bg-gray-100'} outline-none`}
            />
            <select
              value={newHabit.category}
              onChange={(e) => setNewHabit({...newHabit, category: e.target.value})}
              className={`w-full px-4 py-3 rounded-lg mb-4 ${isDark ? 'bg-gray-700' : 'bg-gray-100'} outline-none`}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{categoryIcons[cat]} {cat}</option>
              ))}
            </select>
            <div className="flex gap-3">
              <button
                onClick={addHabit}
                className="flex-1 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 font-medium"
              >
                Создать
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setNewHabit({ name: '', category: 'Учёба' });
                }}
                className={`flex-1 ${isDark ? 'bg-gray-700' : 'bg-gray-100'} py-3 rounded-lg font-medium`}
              >
                Отмена
              </button>
            </div>
          </div>
        )}

        {/* Habits List */}
        {habits.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-xl">Пока нет привычек</p>
            <p className="mt-2">Добавьте первую привычку, чтобы начать</p>
          </div>
        ) : (
          <div className="space-y-4">
            {habits.map(habit => (
              <div key={habit.id} className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{categoryIcons[habit.category]}</span>
                    <div>
                      <h4 className="text-lg font-semibold">{habit.name}</h4>
                      <p className="text-sm text-gray-400">{habit.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => deleteHabit(habit.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-6 mb-4">
                  <div className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-orange-500" />
                    <span className="font-medium">Серия</span>
                    <span className="font-bold text-orange-500">{getStreak(habit)} дней</span>
                  </div>
                  <div className="text-sm text-gray-400">
                    Выполнено за месяц: <span className="font-medium text-blue-500">{getMonthlyCompletion(habit)}%</span>
                  </div>
                </div>

                <div className={`w-full ${isDark ? 'bg-gray-700' : 'bg-gray-100'} rounded-full h-2 mb-4`}>
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{width: `${getMonthlyCompletion(habit)}%`}}
                  />
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1">
                  {monthDays.map((day, idx) => {
                    const isCompleted = isCompletedOnDate(habit, day);
                    const isToday = day.toDateString() === new Date().toDateString();
                    const isPast = day < new Date().setHours(0,0,0,0);
                    
                    return (
                      <button
                        key={idx}
                        onClick={() => toggleCompletion(habit.id, day)}
                        disabled={!isToday && isPast}
                        className={`
                          aspect-square rounded flex items-center justify-center text-xs font-medium
                          ${isCompleted ? 'bg-green-500 text-white' : isDark ? 'bg-gray-700' : 'bg-gray-200'}
                          ${isToday ? 'ring-2 ring-blue-500' : ''}
                          ${!isToday && isPast ? 'opacity-50' : 'hover:opacity-80'}
                        `}
                      >
                        {day.getDate()}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
