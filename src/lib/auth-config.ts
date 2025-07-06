export interface AuthProvider {
  id: string;
  name: string;
  enabled: boolean;
  icon: string;
  color?: string;
}

export const authProviders: AuthProvider[] = [
  {
    id: 'google',
    name: 'Google',
    enabled: true,
    icon: 'google',
    color: 'text-red-500',
  },
  {
    id: 'github',
    name: 'GitHub',
    enabled: true,
    icon: 'github',
    color: 'text-gray-900',
  },
  {
    id: 'discord',
    name: 'Discord',
    enabled: true,
    icon: 'discord',
    color: 'text-indigo-500',
  },
  {
    id: 'twitter',
    name: 'Twitter',
    enabled: true,
    icon: 'twitter',
    color: 'text-blue-500',
  },
];

export const getEnabledProviders = () => authProviders.filter(provider => provider.enabled);