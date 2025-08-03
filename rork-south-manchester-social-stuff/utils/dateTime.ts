export const formatEventDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const eventDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
  if (eventDate.getTime() === today.getTime()) return 'Today';
  if (eventDate.getTime() === tomorrow.getTime()) return 'Tomorrow';
  if (eventDate.getTime() === yesterday.getTime()) return 'Yesterday';
  
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
};

export const formatEventTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
};

export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMins = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInMins < 1) return 'Just now';
  if (diffInMins < 60) return `${diffInMins}m ago`;
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInDays < 7) return `${diffInDays}d ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const formatChatTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
  if (messageDate.getTime() === today.getTime()) {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  }
  
  if (messageDate.getTime() === yesterday.getTime()) {
    return 'Yesterday';
  }
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const isEventUpcoming = (dateString: string): boolean => {
  return new Date(dateString) > new Date();
};

export const getEventStatus = (startDateString: string, endDateString?: string): string => {
  const now = new Date();
  const startDate = new Date(startDateString);
  const endDate = endDateString ? new Date(endDateString) : new Date(startDate.getTime() + 2 * 60 * 60 * 1000);
  
  if (now < startDate) {
    const daysUntil = Math.ceil((startDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntil === 1 ? 'Tomorrow' : `In ${daysUntil} days`;
  }
  
  if (now >= startDate && now <= endDate) {
    return 'Happening now';
  }
  
  return 'Past event';
}; 