/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  ShieldAlert, 
  History, 
  Radar, 
  UserCheck, 
  ShieldCheck, 
  Settings, 
  Plus, 
  Search, 
  Bell, 
  Shield, 
  HelpCircle, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Activity,
  Globe,
  MoreHorizontal,
  Database,
  Server,
  Globe2,
  UploadCloud,
  X,
  FileText,
  Mail,
  Send,
  FileWarning,
  Trash2,
  Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { cn } from './lib/utils';

// --- Types ---

interface StatCardProps {
  label: string;
  value: string;
  trend?: string;
  icon: React.ReactNode;
  iconColor: string;
  progress?: number;
}

interface EventLog {
  id: string;
  timestamp: string;
  source: string;
  action: string;
  status: 'CRITICAL' | 'INFO' | 'WARN';
}

interface NodeStatus {
  id: string;
  name: string;
  status: string;
  progress: number;
  type: 'scanning' | 'idle' | 'warning';
}

// --- Mock Data ---

const THREAT_TRENDS = [
  { name: '00:00', value: 40 },
  { name: '02:00', value: 60 },
  { name: '04:00', value: 55 },
  { name: '06:00', value: 85 },
  { name: '08:00', value: 95 },
  { name: '10:00', value: 70 },
  { name: '12:00', value: 50 },
  { name: '14:00', value: 45 },
  { name: '16:00', value: 30 },
  { name: '18:00', value: 40 },
  { name: '20:00', value: 60 },
  { name: '22:00', value: 75 },
];

const EVENT_LOGS: EventLog[] = [
  { id: '1', timestamp: '14:22:08', source: '192.168.1.105', action: 'Brute-force Attempt Blocked', status: 'CRITICAL' },
  { id: '2', timestamp: '14:20:45', source: 'System:Kernel', action: 'SSL Certificate Renewed', status: 'INFO' },
  { id: '3', timestamp: '14:18:12', source: 'US-WEST-2-NODE', action: 'Unauthorized SQL Query Spike', status: 'WARN' },
  { id: '4', timestamp: '14:15:30', source: 'Admin:JohnDoe', action: 'Global Firewall Rule Updated', status: 'INFO' },
];

const NODE_STATUSES: NodeStatus[] = [
  { id: '1', name: 'Database Cluster A', status: 'Scanning...', progress: 65, type: 'scanning' },
  { id: '2', name: 'API Gateway', status: 'Idle', progress: 100, type: 'idle' },
  { id: '3', name: 'Web Front-end Tier', status: 'Warning Found', progress: 88, type: 'warning' },
];

// --- Sub-components ---

const SidebarItem = ({ icon: Icon, label, active = false, onClick }: { icon: any, label: string, active?: boolean, onClick?: () => void }) => (
  <button 
    onClick={onClick}
    className={cn(
    "flex items-center gap-3 px-3 py-2 w-full rounded-lg transition-all duration-200 font-headline tracking-tight",
    active 
      ? "text-primary bg-surface-container-high font-bold" 
      : "text-outline hover:text-primary hover:bg-surface-container-high"
  )}>
    <Icon className="w-5 h-5" />
    <span>{label}</span>
  </button>
);

const StatCard = ({ label, value, trend, icon, iconColor, progress }: StatCardProps) => (
  <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/10 flex flex-col justify-between group hover:border-primary/20 transition-all duration-300">
    <div className="flex justify-between items-start">
      <span className="text-[10px] font-label uppercase tracking-wider text-on-surface-variant">{label}</span>
      <div className={cn("p-1.5 rounded-lg bg-surface-container-high", iconColor)}>
        {icon}
      </div>
    </div>
    <div className="mt-4">
      <h3 className="text-3xl font-headline font-bold">{value}</h3>
      {trend && (
        <p className={cn("text-[10px] mt-1 flex items-center gap-1 font-medium", iconColor)}>
          <TrendingUp className="w-3 h-3" />
          {trend}
        </p>
      )}
      {progress !== undefined && (
        <div className="w-full bg-surface-container-high h-1.5 rounded-full mt-3 overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="bg-primary h-full rounded-full" 
          />
        </div>
      )}
    </div>
  </div>
);

// --- Upload Modal Component ---

const UploadModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  if (!isOpen) return null;

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const startScan = () => {
    if (!selectedFile) return;
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setSelectedFile(null);
      onClose();
      // Show placeholder success alert for scan initialization
      alert(`Started scan on ${selectedFile.name}`);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-surface-container-low border border-outline-variant/20 rounded-2xl w-full max-w-md shadow-2xl shadow-black/50 overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-outline-variant/10">
          <h2 className="font-headline font-bold text-lg flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            New Security Scan
          </h2>
          <button onClick={onClose} className="p-1.5 hover:bg-surface-container-high rounded-lg text-on-surface-variant transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 flex flex-col items-center">
          <div 
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-upload')?.click()}
            className={cn(
              "w-full h-48 border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-4 cursor-pointer transition-all duration-300",
              isDragging ? "border-primary bg-primary/10" : "border-outline-variant/40 hover:border-primary/50 hover:bg-surface-container-high/50"
            )}
          >
            <input 
              id="file-upload" 
              type="file" 
              className="hidden" 
              onChange={(e) => e.target.files && setSelectedFile(e.target.files[0])} 
            />
            {selectedFile ? (
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="p-3 bg-primary/20 rounded-full text-primary">
                  <FileText className="w-8 h-8" />
                </div>
                <div>
                  <p className="font-bold text-sm">{selectedFile.name}</p>
                  <p className="text-[10px] text-on-surface-variant mt-1">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 text-center text-on-surface-variant">
                <div className="p-3 bg-surface-container-high rounded-full">
                  <UploadCloud className="w-8 h-8" />
                </div>
                <div>
                  <p className="font-medium text-sm text-on-surface">Click to upload or drag & drop</p>
                  <p className="text-[10px] mt-1">Supports PE, ELF, PDF, ZIP, PCAP</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-outline-variant/10 bg-surface-container-lowest/50 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-bold text-on-surface-variant hover:text-on-surface transition-colors">
            Cancel
          </button>
          <button 
            disabled={!selectedFile || isScanning}
            onClick={startScan}
            className="px-6 py-2 bg-gradient-to-r from-primary to-primary-container text-on-primary text-sm font-bold rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all shadow-lg shadow-primary/20"
          >
            {isScanning ? (
              <>
                <Radar className="w-4 h-4 animate-spin" />
                Initializing...
              </>
            ) : (
              'Start Scan'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Generic Modal Component ---

const GenericModal = ({ isOpen, onClose, title, icon: Icon, children }: { isOpen: boolean; onClose: () => void; title: string; icon: any; children: React.ReactNode }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-surface-container-low border border-outline-variant/20 rounded-2xl w-full max-w-md shadow-2xl shadow-black/50 overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-outline-variant/10">
          <h2 className="font-headline font-bold text-lg flex items-center gap-2">
            {Icon && <Icon className="w-5 h-5 text-primary" />}
            {title}
          </h2>
          <button onClick={onClose} className="p-1.5 hover:bg-surface-container-high rounded-lg text-on-surface-variant transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 text-on-surface-variant">
          {children}
        </div>
        <div className="p-4 border-t border-outline-variant/10 bg-surface-container-lowest/50 flex justify-end">
          <button onClick={onClose} className="px-6 py-2 bg-gradient-to-r from-primary to-primary-container text-on-primary text-sm font-bold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-primary/20">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Placeholder View ---

const PlaceholderView = ({ title }: { title: string }) => (
  <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
    <div className="p-6 bg-surface-container-low border border-outline-variant/20 rounded-3xl max-w-md w-full glass-panel">
      <div className="w-16 h-16 bg-surface-container-high rounded-full flex items-center justify-center mx-auto mb-6">
        <Activity className="w-8 h-8 text-primary opacity-50 pulse-ring" />
      </div>
      <h2 className="text-2xl font-headline font-bold text-on-surface mb-2">{title} Module</h2>
      <p className="text-on-surface-variant text-sm mb-6">
        This area is currently under construction. Check back soon for full functionality.
      </p>
      <div className="w-full bg-surface-container-lowest h-2 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: "45%" }}
          transition={{ duration: 2, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
          className="bg-primary h-full rounded-full" 
        />
      </div>
    </div>
  </div>
);

const SPAM_RESULTS = [
  { id: 'msg-1', timestamp: '10:45:12', sender: 'support@paypa1-security.com', subject: 'URGENT: Your account has been suspended', threatLevel: 'CRITICAL', action: 'QUARANTINED' },
  { id: 'msg-2', timestamp: '10:12:00', sender: 'ceo@company-wire-request.net', subject: 'Action required: Wire Transfer Q3', threatLevel: 'CRITICAL', action: 'BLOCKED' },
  { id: 'msg-3', timestamp: '09:24:18', sender: 'marketing@newsletter.com', subject: 'Weekly digest: Top trends', threatLevel: 'LOW', action: 'DELIVERED' },
  { id: 'msg-4', timestamp: '08:15:33', sender: 'hr-updates@mycompany.internal-portal.com', subject: 'Updated Employee Benefits Policy.pdf', threatLevel: 'WARN', action: 'QUARANTINED' },
  { id: 'msg-5', timestamp: '07:42:10', sender: 'no-reply@amazon-delivery-status.info', subject: 'Your package could not be delivered', threatLevel: 'CRITICAL', action: 'BLOCKED' },
];

const PasteEmailModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [emailBody, setEmailBody] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{ status: 'CRITICAL' | 'WARN' | 'SAFE', score: number, reasons: string[] } | null>(null);

  if (!isOpen) return null;

  const analyzeEmail = () => {
    if (!emailBody.trim()) return;
    setIsScanning(true);
    setScanResult(null);
    setTimeout(() => {
      setIsScanning(false);
      
      const lowerBody = emailBody.toLowerCase();
      let score = 0;
      let reasons: string[] = [];

      // Heuristic 1: Keyword density
      const highRiskKeywords = ['password', 'urgent', 'verify', 'account suspended', 'login', 'bank', 'winner', 'click here', 'wire transfer', 'invoice', 'payment required'];
      const foundKeywords = highRiskKeywords.filter(kw => lowerBody.includes(kw));
      if (foundKeywords.length > 0) {
        score += foundKeywords.length * 15;
        reasons.push(`Suspicious keywords found: ${foundKeywords.join(', ')}`);
      }

      // Heuristic 2: Link Analysis
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const urls = emailBody.match(urlRegex) || [];
      const suspiciousDomains = ['bit.ly', 'tinyurl', 'ngrok.io'];
      
      const foundSuspiciousUrls = urls.filter(url => suspiciousDomains.some(domain => url.includes(domain)) || /https?:\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(url));
      
      if (foundSuspiciousUrls.length > 0) {
        score += 45;
        reasons.push('Contains suspicious masked links or direct IP routing');
      } else if (urls.length > 3) {
        score += 15;
        reasons.push('High concentration of external links');
      }

      // Heuristic 3: Suspicious Formatting
      const capsRegex = /[A-Z]{4,}/g; // 4+ consecutive caps
      const capsMatch = emailBody.match(capsRegex);
      if (capsMatch && capsMatch.length > 3) {
        score += 10;
        reasons.push('Excessive capitalization detected');
      }
      
      if (emailBody.includes('!')) {
         const exclamationCount = (emailBody.match(/!/g) || []).length;
         if (exclamationCount > 4) {
           score += 10;
           reasons.push('Artificial urgency phrasing (excessive punctuation)');
         }
      }

      const finalScore = Math.min(score, 100);
      let status: 'CRITICAL' | 'WARN' | 'SAFE' = 'SAFE';
      
      if (finalScore >= 50) status = 'CRITICAL';
      else if (finalScore >= 20) status = 'WARN';
      
      setScanResult({
         status,
         score: finalScore,
         reasons: reasons.length > 0 ? reasons : ['No malicious signatures or anomalies found.']
      });
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-surface-container-low border border-outline-variant/20 rounded-2xl w-full max-w-2xl shadow-2xl shadow-black/50 overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-outline-variant/10">
          <h2 className="font-headline font-bold text-lg flex items-center gap-2">
            <Mail className="w-5 h-5 text-primary" />
            Analyze Email Content
          </h2>
          <button onClick={onClose} className="p-1.5 hover:bg-surface-container-high rounded-lg text-on-surface-variant transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 flex flex-col gap-4">
          <div>
            <label className="text-xs font-label uppercase tracking-wider text-on-surface-variant mb-2 block">Raw Email Source or Body</label>
            <textarea 
              value={emailBody}
              onChange={(e) => setEmailBody(e.target.value)}
              placeholder="Paste email headers or body text here..."
              className="w-full h-48 bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-4 text-sm font-mono text-on-surface focus:ring-1 focus:ring-primary focus:outline-none custom-scrollbar resize-none"
            />
          </div>

          {scanResult && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "p-4 rounded-xl border flex flex-col gap-3",
                scanResult.status === 'CRITICAL' ? "bg-error-container/10 border-error/30 text-error" : 
                scanResult.status === 'WARN' ? "bg-tertiary-container/10 border-tertiary/30 text-tertiary" : 
                "bg-primary-container/10 border-primary/30 text-primary"
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold font-headline">
                   {scanResult.status === 'CRITICAL' ? <ShieldAlert className="w-5 h-5 shrink-0" /> : 
                    scanResult.status === 'WARN' ? <FileWarning className="w-5 h-5 shrink-0" /> : 
                    <ShieldCheck className="w-5 h-5 shrink-0" />}
                   <span>{scanResult.status}: Threat Score {scanResult.score}/100</span>
                </div>
              </div>
              
              <ul className="text-sm font-medium space-y-1 list-disc list-inside">
                 {scanResult.reasons.map((reason, idx) => (
                    <li key={idx} className="opacity-80">{reason}</li>
                 ))}
              </ul>
            </motion.div>
          )}
        </div>

        <div className="p-4 border-t border-outline-variant/10 bg-surface-container-lowest/50 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-bold text-on-surface-variant hover:text-on-surface transition-colors">
            {scanResult ? "Close" : "Cancel"}
          </button>
          {!scanResult && (
            <button 
              disabled={!emailBody.trim() || isScanning}
              onClick={analyzeEmail}
              className="px-6 py-2 bg-gradient-to-r from-primary to-primary-container text-on-primary text-sm font-bold rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all shadow-lg shadow-primary/20"
            >
              {isScanning ? (
                <>
                  <Radar className="w-4 h-4 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <Activity className="w-4 h-4" />
                  Analyze Content
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const AnalyzeUrlModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [urlInput, setUrlInput] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{ status: 'CRITICAL' | 'WARN' | 'SAFE', score: number, reasons: string[] } | null>(null);

  if (!isOpen) return null;

  const analyzeUrl = () => {
    if (!urlInput.trim()) return;
    setIsScanning(true);
    setScanResult(null);
    setTimeout(() => {
      setIsScanning(false);
      
      const targetUrl = urlInput.toLowerCase().trim();
      let score = 0;
      let reasons: string[] = [];

      // Ensure it has protocol
      if (!targetUrl.startsWith('http')) {
        score += 20;
        reasons.push('Missing explicit protocol (HTTPS vs HTTP)');
      } else if (targetUrl.startsWith('http://')) {
        score += 30;
        reasons.push('Insecure protocol (HTTP instead of HTTPS)');
      }

      // Check for raw IPs
      const ipRegex = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/;
      if (ipRegex.test(targetUrl)) {
        score += 50;
        reasons.push('Direct IP address routing detected');
      }

      // Check for suspicious TLDs
      const suspiciousTlds = ['.xyz', '.top', '.tk', '.ml', '.ga', '.cf', '.gq', '.pw'];
      if (suspiciousTlds.some(tld => targetUrl.includes(tld))) {
        score += 40;
        reasons.push('High-risk Top Level Domain (TLD)');
      }

      // Check for deceptive keywords in subdomains/paths
      const deceptiveKeywords = ['login', 'secure', 'bank', 'account', 'verify', 'update', 'paypal', 'apple', 'microsoft', 'support'];
      const foundKeywords = deceptiveKeywords.filter(kw => targetUrl.includes(kw));
      if (foundKeywords.length > 0) {
        score += foundKeywords.length * 20;
        reasons.push(`Suspicious branding keywords found in URL: ${foundKeywords.join(', ')}`);
      }

      // Check URL length
      if (targetUrl.length > 75) {
        score += 15;
        reasons.push('Unusually long URL structure');
      }

      // Check for multiple subdomains
      const urlParts = targetUrl.replace('https://', '').replace('http://', '').split('/')[0].split('.');
      if (urlParts.length > 3 && !targetUrl.includes('www')) {
         score += 20;
         reasons.push('Deep sub-domain nesting detected (possible typo-squatting or evasion)');
      }

      const finalScore = Math.min(score, 100);
      let status: 'CRITICAL' | 'WARN' | 'SAFE' = 'SAFE';
      
      if (finalScore >= 50) status = 'CRITICAL';
      else if (finalScore >= 20) status = 'WARN';
      
      setScanResult({
         status,
         score: finalScore,
         reasons: reasons.length > 0 ? reasons : ['No known malicious patterns detected in URL structure.']
      });
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-surface-container-low border border-outline-variant/20 rounded-2xl w-full max-w-lg shadow-2xl shadow-black/50 overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-outline-variant/10">
          <h2 className="font-headline font-bold text-lg flex items-center gap-2">
            <Globe2 className="w-5 h-5 text-primary" />
            Analyze Website URL
          </h2>
          <button onClick={onClose} className="p-1.5 hover:bg-surface-container-high rounded-lg text-on-surface-variant transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 flex flex-col gap-4">
          <div>
            <label className="text-xs font-label uppercase tracking-wider text-on-surface-variant mb-2 block">Target Destination URL</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Globe2 className="w-4 h-4 text-outline" />
              </div>
              <input 
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com"
                className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-xl py-3 pl-10 pr-4 text-sm font-mono text-on-surface focus:ring-1 focus:ring-primary focus:outline-none"
              />
            </div>
          </div>

          {scanResult && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "p-4 rounded-xl border flex flex-col gap-3",
                scanResult.status === 'CRITICAL' ? "bg-error-container/10 border-error/30 text-error" : 
                scanResult.status === 'WARN' ? "bg-tertiary-container/10 border-tertiary/30 text-tertiary" : 
                "bg-primary-container/10 border-primary/30 text-primary"
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold font-headline">
                   {scanResult.status === 'CRITICAL' ? <ShieldAlert className="w-5 h-5 shrink-0" /> : 
                    scanResult.status === 'WARN' ? <FileWarning className="w-5 h-5 shrink-0" /> : 
                    <ShieldCheck className="w-5 h-5 shrink-0" />}
                   <span>{scanResult.status}: Threat Score {scanResult.score}/100</span>
                </div>
              </div>
              
              <ul className="text-sm font-medium space-y-1 list-disc list-inside">
                 {scanResult.reasons.map((reason, idx) => (
                    <li key={idx} className="opacity-80">{reason}</li>
                 ))}
              </ul>
            </motion.div>
          )}
        </div>

        <div className="p-4 border-t border-outline-variant/10 bg-surface-container-lowest/50 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-bold text-on-surface-variant hover:text-on-surface transition-colors">
            {scanResult ? "Close" : "Cancel"}
          </button>
          {!scanResult && (
            <button 
              disabled={!urlInput.trim() || isScanning}
              onClick={analyzeUrl}
              className="px-6 py-2 bg-gradient-to-r from-primary to-primary-container text-on-primary text-sm font-bold rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all shadow-lg shadow-primary/20"
            >
              {isScanning ? (
                <>
                  <Radar className="w-4 h-4 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <Activity className="w-4 h-4" />
                  Run URL Scan
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const PhishingDetectView = () => {
  const [isAnalyzeModalOpen, setIsAnalyzeModalOpen] = useState(false);
  const [isAnalyzeUrlModalOpen, setIsAnalyzeUrlModalOpen] = useState(false);

  return (
    <div className="flex-1 flex flex-col overflow-hidden h-full">
      <PasteEmailModal isOpen={isAnalyzeModalOpen} onClose={() => setIsAnalyzeModalOpen(false)} />
      <AnalyzeUrlModal isOpen={isAnalyzeUrlModalOpen} onClose={() => setIsAnalyzeUrlModalOpen(false)} />
      
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-2xl font-headline font-bold text-primary flex items-center gap-2">
              <ShieldAlert className="w-6 h-6" />
              Phishing & Spam Defense
            </h1>
            <p className="text-sm text-on-surface-variant mt-1">Real-time analysis of incoming email vectors and malicious payloads.</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setIsAnalyzeUrlModalOpen(true)}
              className="px-5 py-2.5 bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant/20 rounded-xl flex items-center gap-2 font-bold font-headline text-sm transition-all shadow-lg shadow-black/20"
            >
              <Globe2 className="w-4 h-4 text-secondary" />
              Analyze URL
            </button>
            <button 
              onClick={() => setIsAnalyzeModalOpen(true)}
              className="px-5 py-2.5 bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant/20 rounded-xl flex items-center gap-2 font-bold font-headline text-sm transition-all shadow-lg shadow-black/20"
            >
              <Mail className="w-4 h-4 text-primary" />
              Analyze Email
            </button>
          </div>
        </div>

        {/* Stats */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/10">
            <span className="text-[10px] font-label uppercase text-on-surface-variant tracking-wider">Intercepted Today</span>
            <div className="mt-2 flex items-end gap-3">
              <h3 className="text-4xl font-headline font-bold text-error">14,204</h3>
              <span className="text-xs text-error pb-1 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> 8.4%</span>
            </div>
          </div>
          <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/10">
            <span className="text-[10px] font-label uppercase text-on-surface-variant tracking-wider">Clean Traffic</span>
            <div className="mt-2 flex items-end gap-3">
              <h3 className="text-4xl font-headline font-bold text-secondary">89.2%</h3>
            </div>
            <div className="w-full bg-surface-container-high h-1.5 rounded-full mt-3 overflow-hidden">
              <div className="bg-secondary h-full rounded-full w-[89.2%]" />
            </div>
          </div>
          <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/10 overflow-hidden relative">
             <div className="relative z-10">
              <span className="text-[10px] font-label uppercase text-on-surface-variant tracking-wider">Quarantine Status</span>
              <div className="mt-2">
                <h3 className="text-xl font-headline font-bold text-on-surface">322 Items Pending</h3>
                <p className="text-xs text-on-surface-variant mt-1">Requires manual analyst review</p>
              </div>
             </div>
             <Shield className="w-32 h-32 absolute -right-6 -bottom-6 text-surface-container-highest opacity-50 pointer-events-none" />
          </div>
        </section>

        {/* Scan Results Table */}
        <section className="bg-surface-container-low rounded-xl border border-outline-variant/10 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-outline-variant/10 flex justify-between items-center bg-surface-container-lowest/30">
            <h2 className="font-headline font-bold flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Recent Scans
            </h2>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary pulse-ring" />
              <span className="text-[10px] text-on-surface-variant tracking-widest uppercase">Live View</span>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-separate border-spacing-0">
              <thead>
                <tr className="text-on-surface-variant font-label text-[10px] uppercase tracking-wider bg-surface-container-high/20">
                  <th className="px-6 py-4 font-semibold">Time</th>
                  <th className="px-6 py-4 font-semibold">Sender</th>
                  <th className="px-6 py-4 font-semibold">Subject / Details</th>
                  <th className="px-6 py-4 font-semibold">Threat Level</th>
                  <th className="px-6 py-4 font-semibold text-right">Action Taken</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {SPAM_RESULTS.map((log) => (
                  <tr key={log.id} className="hover:bg-surface-container-high/40 transition-colors group">
                    <td className="px-6 py-4 text-xs font-mono text-on-surface-variant w-24">{log.timestamp}</td>
                    <td className="px-6 py-4 font-medium max-w-[200px] truncate" title={log.sender}>{log.sender}</td>
                    <td className="px-6 py-4 text-on-surface-variant max-w-[300px] truncate" title={log.subject}>{log.subject}</td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2.5 py-1 rounded-full text-[9px] font-bold tracking-wider",
                        log.threatLevel === 'CRITICAL' ? 'bg-error-container/20 text-error' : 
                        log.threatLevel === 'WARN' ? 'bg-tertiary-container/30 text-tertiary' : 
                        'bg-secondary-container/30 text-secondary'
                      )}>
                        {log.threatLevel}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={cn(
                        "text-xs font-bold font-headline select-none",
                        log.action === 'BLOCKED' ? "text-error" : log.action === 'QUARANTINED' ? "text-tertiary" : "text-outline"
                      )}>
                        {log.action}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

// --- Main Component ---

export default function App() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const getModalProps = () => {
    switch (activeModal) {
      case 'settings': return { title: 'Settings', icon: Settings, content: <p>Configure your dashboard layout, alerts, and user preferences here.</p> };
      case 'notifications': return { title: 'Notifications', icon: Bell, content: <p>You have 3 new critical alerts. Please review the security logs immediately.</p> };
      case 'security': return { title: 'Security Status', icon: Shield, content: <p>System health is currently at 94%. All perimeter defenses are active and scanning.</p> };
      case 'help': return { title: 'Help Center', icon: HelpCircle, content: <p>Need assistance? Contact our 24/7 SOC team or browse the system documentation.</p> };
      case 'nodes': return { title: 'Manage Nodes', icon: Server, content: <p>Configure routing, capacity, and load balancing for your active server nodes.</p> };
      case 'history': return { title: 'Event History', icon: History, content: <p>View full archived security event logs for the past 30 days.</p> };
      default: return null;
    }
  };
  const modalProps = getModalProps();

  return (
    <>
      <UploadModal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} />
      <GenericModal isOpen={!!activeModal} onClose={() => setActiveModal(null)} title={modalProps?.title || ''} icon={modalProps?.icon}>
        {modalProps?.content}
      </GenericModal>
      <div className="flex h-screen overflow-hidden bg-background text-on-surface font-body">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col h-full w-64 border-r border-outline-variant/15 bg-surface backdrop-blur-xl p-4 shrink-0">
        <div className="mb-10 px-2">
          <span className="text-2xl font-bold bg-gradient-to-br from-primary to-primary-container bg-clip-text text-transparent font-headline tracking-tight">
            CyberShield
          </span>
          <p className="text-[10px] text-on-surface-variant font-label mt-1 uppercase tracking-widest">Security Analyst</p>
        </div>

        <nav className="flex-1 space-y-1">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" active={activeTab === 'Dashboard'} onClick={() => setActiveTab('Dashboard')} />
          <SidebarItem icon={ShieldAlert} label="Phishing Detect" active={activeTab === 'Phishing Detect'} onClick={() => setActiveTab('Phishing Detect')} />
          <SidebarItem icon={History} label="Log Anomaly" active={activeTab === 'Log Anomaly'} onClick={() => setActiveTab('Log Anomaly')} />
          <SidebarItem icon={Radar} label="Vulnerability Scan" active={activeTab === 'Vulnerability Scan'} onClick={() => setActiveTab('Vulnerability Scan')} />
          <SidebarItem icon={UserCheck} label="Media Trust" active={activeTab === 'Media Trust'} onClick={() => setActiveTab('Media Trust')} />
          <SidebarItem icon={ShieldCheck} label="Admin" active={activeTab === 'Admin'} onClick={() => setActiveTab('Admin')} />
        </nav>

        <div className="mt-auto pt-4 space-y-4">
          <button 
            onClick={() => setIsUploadModalOpen(true)}
            className="w-full py-3 px-4 bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-lg shadow-primary/10">
            <Plus className="w-5 h-5" />
            <span className="font-headline">New Scan</span>
          </button>
          <button 
            onClick={() => setActiveModal('settings')}
            className="flex items-center gap-3 px-3 py-2 w-full text-outline hover:text-primary transition-colors font-headline">
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </button>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="flex justify-between items-center w-full px-6 py-4 border-b border-outline-variant/15 bg-surface/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-8 flex-1">
            <span className="hidden md:block text-lg font-bold text-primary font-headline">Dashboard</span>
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search security logs..." 
                className="w-full bg-surface-container-lowest border-none rounded-full pl-10 pr-4 py-2 text-sm focus:ring-1 focus:ring-primary text-on-surface placeholder:text-outline/50"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setActiveModal('notifications')}
              className="p-2 text-on-surface-variant hover:text-primary transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-surface" />
            </button>
            <button 
              onClick={() => setActiveModal('security')}
              className="p-2 text-on-surface-variant hover:text-primary transition-colors">
              <Shield className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setActiveModal('help')}
              className="p-2 text-on-surface-variant hover:text-primary transition-colors">
              <HelpCircle className="w-5 h-5" />
            </button>
            <div className="h-9 w-9 rounded-full bg-surface-container-high border border-outline-variant/30 flex items-center justify-center overflow-hidden ml-2 cursor-pointer hover:border-primary/50 transition-colors">
              <img 
                src="https://picsum.photos/seed/analyst/100/100" 
                alt="Profile" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        {activeTab === 'Phishing Detect' ? (
          <PhishingDetectView />
        ) : activeTab !== 'Dashboard' ? (
          <PlaceholderView title={activeTab} />
        ) : (
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {/* Hero Stats */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard 
              label="Total Scans" 
              value="1,284,092" 
              trend="+12.5% vs last 24h" 
              icon={<Activity className="w-4 h-4" />} 
              iconColor="text-primary"
            />
            <StatCard 
              label="Active Threats" 
              value="14" 
              trend="2 Critical requires attention" 
              icon={<AlertTriangle className="w-4 h-4" />} 
              iconColor="text-error"
            />
            <StatCard 
              label="Mitigated" 
              value="482" 
              trend="99.8% success rate" 
              icon={<CheckCircle2 className="w-4 h-4" />} 
              iconColor="text-secondary"
            />
            <StatCard 
              label="Security Health" 
              value="94%" 
              progress={94}
              icon={<ShieldCheck className="w-4 h-4" />} 
              iconColor="text-primary"
            />
          </section>

          {/* Visualization Grid */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Map Visualization */}
            <div className="lg:col-span-8 bg-surface-container-low rounded-xl border border-outline-variant/10 overflow-hidden flex flex-col min-h-[400px]">
              <div className="p-4 flex justify-between items-center border-b border-outline-variant/10">
                <h2 className="font-headline font-bold flex items-center gap-2">
                  <Globe className="w-5 h-5 text-primary" />
                  Global Attack Origins
                </h2>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary pulse-ring" />
                  <span className="text-[10px] text-on-surface-variant font-label uppercase tracking-widest">Live Data</span>
                </div>
              </div>
              <div className="flex-1 relative bg-surface-container-lowest overflow-hidden group">
                <img 
                  src="https://picsum.photos/seed/cybermap/1200/800?grayscale&blur=2" 
                  alt="Global heatmap" 
                  className="w-full h-full object-cover opacity-20 mix-blend-luminosity transition-transform duration-1000 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                
                {/* Tactical Overlay Elements */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end pointer-events-none">
                  <div className="flex flex-wrap gap-4">
                    <div className="glass-panel p-3 rounded-lg border border-outline-variant/20">
                      <p className="text-[10px] text-on-surface-variant uppercase tracking-tighter mb-1">Primary Vector</p>
                      <p className="text-sm font-bold text-primary">Distributed Denial (DDoS)</p>
                    </div>
                    <div className="glass-panel p-3 rounded-lg border border-outline-variant/20">
                      <p className="text-[10px] text-on-surface-variant uppercase tracking-tighter mb-1">Peak Origin</p>
                      <p className="text-sm font-bold text-secondary">Frankfurt, DE (18.2%)</p>
                    </div>
                  </div>
                </div>

                {/* Animated Markers */}
                <div className="absolute top-1/3 left-1/4 w-3 h-3 bg-error rounded-full pulse-ring" />
                <div className="absolute top-1/2 left-2/3 w-4 h-4 bg-error rounded-full pulse-ring" />
                <div className="absolute top-1/4 left-1/2 w-2 h-2 bg-primary rounded-full pulse-ring" />
                
                {/* SVG Connections */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
                  <motion.path 
                    d="M 300 200 Q 500 100 800 400" 
                    fill="transparent" 
                    stroke="var(--color-error)" 
                    strokeWidth="1" 
                    strokeDasharray="5,5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                </svg>
              </div>
            </div>

            {/* Alert Severity & Trends */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/10 flex-1 flex flex-col">
                <h2 className="font-headline font-bold mb-6 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-tertiary" />
                  Alert Severity
                </h2>
                <div className="space-y-6">
                  {[
                    { label: 'High Priority', count: 12, color: 'bg-error', width: '15%' },
                    { label: 'Medium Priority', count: 84, color: 'bg-tertiary', width: '45%' },
                    { label: 'Low Priority', count: 142, color: 'bg-secondary', width: '70%' },
                  ].map((item) => (
                    <div key={item.label} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={cn("w-2.5 h-2.5 rounded-full", item.color)} />
                          <span className="text-sm font-medium">{item.label}</span>
                        </div>
                        <span className="text-sm font-bold font-headline">{item.count}</span>
                      </div>
                      <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: item.width }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          className={cn("h-full rounded-full", item.color)} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/10">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-headline font-bold">Threat Trends</h3>
                  <select className="bg-transparent border-none text-[10px] text-primary focus:ring-0 p-0 font-label cursor-pointer hover:text-primary-container transition-colors">
                    <option>Last 24h</option>
                    <option>Last 7d</option>
                  </select>
                </div>
                <div className="h-32 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={THREAT_TRENDS}>
                      <Bar dataKey="value" radius={[2, 2, 0, 0]}>
                        {THREAT_TRENDS.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={index === 4 ? 'var(--color-primary)' : 'rgba(152, 203, 255, 0.2)'} 
                            className="hover:fill-primary transition-colors duration-300 cursor-pointer"
                          />
                        ))}
                      </Bar>
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'var(--color-surface-container-high)', border: 'none', borderRadius: '8px', fontSize: '10px' }}
                        itemStyle={{ color: 'var(--color-primary)' }}
                        cursor={{ fill: 'transparent' }}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </section>

          {/* Activity Feed & Node Monitoring */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-surface-container-low rounded-xl border border-outline-variant/10 flex flex-col overflow-hidden">
              <div className="p-4 border-b border-outline-variant/10 flex justify-between items-center">
                <h2 className="font-headline font-bold flex items-center gap-2">
                  <History className="w-5 h-5 text-secondary" />
                  Live Security Event Log
                </h2>
                <button 
                  onClick={() => setActiveModal('history')}
                  className="text-[10px] text-primary hover:text-primary-container font-label uppercase tracking-widest transition-colors">
                  View History
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-separate border-spacing-0">
                  <thead>
                    <tr className="text-on-surface-variant font-label text-[10px] uppercase tracking-wider bg-surface-container-high/30">
                      <th className="px-6 py-4 font-semibold">Timestamp</th>
                      <th className="px-6 py-4 font-semibold">Event Source</th>
                      <th className="px-6 py-4 font-semibold">Action</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/10">
                    {EVENT_LOGS.map((log) => (
                      <tr key={log.id} className="hover:bg-surface-container-high/40 transition-colors group cursor-pointer">
                        <td className="px-6 py-4 text-xs font-mono text-on-surface-variant">{log.timestamp}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className={cn(
                              "w-2 h-2 rounded-full",
                              log.status === 'CRITICAL' ? 'bg-error' : log.status === 'WARN' ? 'bg-tertiary' : 'bg-secondary'
                            )} />
                            <span className="font-medium">{log.source}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-on-surface-variant">{log.action}</td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "px-2.5 py-1 rounded-full text-[9px] font-bold tracking-wider",
                            log.status === 'CRITICAL' ? 'bg-error-container text-error' : 
                            log.status === 'WARN' ? 'bg-tertiary-container/30 text-tertiary' : 
                            'bg-secondary-container/30 text-secondary'
                          )}>
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/10 flex flex-col gap-6">
              <h2 className="font-headline font-bold flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Active Node Monitoring
              </h2>
              <div className="space-y-6 flex-1">
                {NODE_STATUSES.map((node) => (
                  <div key={node.id} className="p-4 bg-surface-container-lowest/50 rounded-xl border border-outline-variant/10 hover:border-primary/30 transition-colors">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-2">
                        {node.type === 'scanning' ? <Radar className="w-3.5 h-3.5 text-primary animate-pulse" /> : 
                         node.type === 'warning' ? <ShieldAlert className="w-3.5 h-3.5 text-error" /> : 
                         <Server className="w-3.5 h-3.5 text-secondary" />}
                        <span className="text-xs font-bold font-headline">{node.name}</span>
                      </div>
                      <span className={cn(
                        "text-[10px] font-medium",
                        node.type === 'warning' ? 'text-error' : 'text-on-surface-variant'
                      )}>
                        {node.status}
                      </span>
                    </div>
                    <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${node.progress}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className={cn(
                          "h-full rounded-full",
                          node.type === 'warning' ? 'bg-error' : 'bg-primary'
                        )} 
                      />
                    </div>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => setActiveModal('nodes')}
                className="w-full py-3 bg-surface-container-high hover:bg-surface-container-highest transition-all rounded-xl text-xs font-headline font-bold border border-outline-variant/10 flex items-center justify-center gap-2">
                <Globe2 className="w-4 h-4" />
                Manage All Nodes
              </button>
            </div>
          </section>
        </div>
        )}
      </main>
      </div>
    </>
  );
}
