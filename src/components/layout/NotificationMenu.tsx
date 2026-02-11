import { Bell, Check, Clock, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

// Fake data for notifications
const notifications = [
    {
        id: 1,
        title: 'New Invoice Received',
        description: 'Invoice #INV-2024-001 from Client A',
        time: '2 mins ago',
        read: false,
        type: 'info'
    },
    {
        id: 2,
        title: 'Payment Successful',
        description: 'Your subscription has been renewed',
        time: '1 hour ago',
        read: false,
        type: 'success'
    },
    {
        id: 3,
        title: 'System Update',
        description: 'System maintenance scheduled for tonight',
        time: '5 hours ago',
        read: true,
        type: 'warning'
    },
    {
        id: 4,
        title: 'New User Added',
        description: 'Sarah Smith joined the workspace',
        time: '1 day ago',
        read: true,
        type: 'info'
    }
]

export function NotificationMenu() {
    const unreadCount = notifications.filter((n) => !n.read).length

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative text-muted-foreground outline-none ring-0"
                >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-2 end-2 w-2 h-2 bg-destructive rounded-full border-2 border-background animate-pulse"></span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">Notifications</p>
                        <p className="text-xs leading-none text-muted-foreground">
                            You have {unreadCount} unread messages
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup className="max-h-[300px] overflow-y-auto">
                    {notifications.map((notification) => (
                        <DropdownMenuItem
                            key={notification.id}
                            className="cursor-pointer p-4 items-start gap-4 space-y-0"
                        >
                            <div
                                className={cn(
                                    'mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border',
                                    notification.type === 'info' && 'bg-blue-100 text-blue-600 border-blue-200',
                                    notification.type === 'success' && 'bg-green-100 text-green-600 border-green-200',
                                    notification.type === 'warning' && 'bg-yellow-100 text-yellow-600 border-yellow-200'
                                )}
                            >
                                {notification.type === 'info' && <Info className="h-4 w-4" />}
                                {notification.type === 'success' && <Check className="h-4 w-4" />}
                                {notification.type === 'warning' && <Clock className="h-4 w-4" />}
                            </div>
                            <div className="grid gap-1">
                                <div className="flex items-center gap-2">
                                    <p className="font-medium text-sm leading-none">
                                        {notification.title}
                                    </p>
                                    {!notification.read && (
                                        <span className="flex h-2 w-2 rounded-full bg-blue-600" />
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground line-clamp-2">
                                    {notification.description}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {notification.time}
                                </p>
                            </div>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="w-full text-center block cursor-pointer text-primary focus:text-primary font-medium p-2">
                    View all notifications
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
