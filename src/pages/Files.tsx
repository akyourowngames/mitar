import { motion } from 'framer-motion';
import { FolderOpen, FileText, Image, File, Upload, Search } from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const files = [
  { id: '1', name: 'Project Proposal.pdf', type: 'pdf', size: '2.4 MB', date: 'Today' },
  { id: '2', name: 'Meeting Notes.txt', type: 'text', size: '12 KB', date: 'Yesterday' },
  { id: '3', name: 'Design Assets.zip', type: 'archive', size: '45 MB', date: '2 days ago' },
  { id: '4', name: 'Screenshot.png', type: 'image', size: '1.2 MB', date: '3 days ago' },
];

const getFileIcon = (type: string) => {
  switch (type) {
    case 'pdf':
      return FileText;
    case 'image':
      return Image;
    default:
      return File;
  }
};

export default function Files() {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      <main className="flex-1 p-6 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Files</h1>
              <p className="text-muted-foreground">Your uploaded documents</p>
            </div>
            <Button variant="glow">
              <Upload className="w-4 h-4" />
              Upload
            </Button>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search files..." className="pl-10" />
          </div>

          {/* File grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {files.map((file, index) => {
              const Icon = getFileIcon(file.type);
              return (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="glass rounded-xl p-4 cursor-pointer group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {file.size} • {file.date}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Empty state */}
          {files.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="w-16 h-16 rounded-2xl bg-secondary mx-auto mb-4 flex items-center justify-center">
                <FolderOpen className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">No files uploaded yet</p>
              <Button variant="glow" className="mt-4">
                <Upload className="w-4 h-4" />
                Upload your first file
              </Button>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
