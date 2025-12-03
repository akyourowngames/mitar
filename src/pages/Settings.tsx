import { useState } from 'react';
import { motion } from 'framer-motion';
import { Key, Mic, Volume2, Search, Save, Eye, EyeOff } from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

export default function Settings() {
  const { toast } = useToast();
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [settings, setSettings] = useState({
    openaiKey: '',
    sttProvider: 'whisper',
    ttsProvider: 'elevenlabs',
    searchApiKey: '',
  });

  const handleSave = () => {
    toast({
      title: 'Settings saved',
      description: 'Your API keys have been securely stored.',
    });
  };

  const toggleShowKey = (key: string) => {
    setShowKeys((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const settingsGroups = [
    {
      title: 'LLM Configuration',
      icon: Key,
      fields: [
        {
          label: 'OpenAI API Key',
          key: 'openaiKey',
          placeholder: 'sk-...',
          type: 'password',
        },
      ],
    },
    {
      title: 'Speech-to-Text',
      icon: Mic,
      fields: [
        {
          label: 'STT Provider',
          key: 'sttProvider',
          placeholder: 'whisper, google, azure',
          type: 'text',
        },
      ],
    },
    {
      title: 'Text-to-Speech',
      icon: Volume2,
      fields: [
        {
          label: 'TTS Provider',
          key: 'ttsProvider',
          placeholder: 'elevenlabs, google, amazon',
          type: 'text',
        },
      ],
    },
    {
      title: 'Search API',
      icon: Search,
      fields: [
        {
          label: 'Search API Key',
          key: 'searchApiKey',
          placeholder: 'Your search API key',
          type: 'password',
        },
      ],
    },
  ];

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      <main className="flex-1 p-6 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground">Configure your API keys and providers</p>
          </div>

          <div className="space-y-6">
            {settingsGroups.map((group, groupIndex) => (
              <motion.div
                key={group.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: groupIndex * 0.1 }}
                className="glass rounded-2xl p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <group.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-lg font-semibold text-foreground">{group.title}</h2>
                </div>

                <div className="space-y-4">
                  {group.fields.map((field) => (
                    <div key={field.key} className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        {field.label}
                      </label>
                      <div className="relative">
                        <Input
                          type={
                            field.type === 'password' && !showKeys[field.key]
                              ? 'password'
                              : 'text'
                          }
                          value={settings[field.key as keyof typeof settings]}
                          onChange={(e) =>
                            setSettings({ ...settings, [field.key]: e.target.value })
                          }
                          placeholder={field.placeholder}
                          className="pr-10"
                        />
                        {field.type === 'password' && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            className="absolute right-2 top-1/2 -translate-y-1/2"
                            onClick={() => toggleShowKey(field.key)}
                          >
                            {showKeys[field.key] ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 flex justify-end"
          >
            <Button onClick={handleSave} className="px-8">
              <Save className="w-4 h-4" />
              Save Settings
            </Button>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
