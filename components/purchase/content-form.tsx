'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { MediaType, MEDIA_PRICES } from '@/lib/pricing';
import { Image as ImageIcon, Video as VideoIcon, Mic as MusicIcon, Upload, Camera, X, Lock, DollarSign, EyeOff, ShieldCheck, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface ContentFormProps {
  contentText: string;
  onContentTextChange: (text: string) => void;
  authorName: string;
  onAuthorNameChange: (name: string) => void;
  visibility: 'Private' | 'For_Sale';
  onVisibilityChange: (visibility: 'Private' | 'For_Sale') => void;
  termsAccepted: boolean;
  onTermsAcceptedChange: (accepted: boolean) => void;
  imageRightsGranted: boolean;
  onImageRightsGrantedChange: (granted: boolean) => void;
  mediaType: MediaType;
  onMediaTypeChange: (type: MediaType) => void;
  mediaUrl: string;
  onMediaUrlChange: (url: string) => void;
  mediaFile: File | null;
  onMediaFileChange: (file: File | null) => void;
}

export function ContentForm({
  contentText,
  onContentTextChange,
  authorName,
  onAuthorNameChange,
  visibility,
  onVisibilityChange,
  termsAccepted,
  onTermsAcceptedChange,
  imageRightsGranted,
  onImageRightsGrantedChange,
  mediaType,
  onMediaTypeChange,
  mediaUrl,
  onMediaUrlChange,
  mediaFile,
  onMediaFileChange,
}: ContentFormProps) {
  const [uploadMethod, setUploadMethod] = useState<'camera' | 'upload'>('upload');

  // ✅ NOUVEAU : choix Upload maintenant vs plus tard via dashboard
  const [mediaUploadTiming, setMediaUploadTiming] = useState<'now' | 'later'>('now');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const mediaOptions: { type: MediaType; label: string; icon: any; desc: string }[] = [
    { type: 'none', label: 'No Media', icon: X, desc: 'Text only' },
    { type: 'photo', label: 'Photo Memory', icon: ImageIcon, desc: 'Immortalize a moment' },
    { type: 'video', label: 'Video Message', icon: VideoIcon, desc: 'Bring your lock to life' },
    { type: 'audio', label: 'Voice Note', icon: MusicIcon, desc: 'Record your vow' },
  ];

  const getAcceptedFileTypes = () => {
    if (mediaType === 'photo') return 'image/jpeg,image/png,image/jpg,image/webp';
    if (mediaType === 'video') return 'video/mp4';
    if (mediaType === 'audio') return 'audio/mpeg,audio/mp3';
    return '';
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      toast.error('File too large. Max size: 50MB');
      return;
    }

    onMediaFileChange(file);
    onMediaUrlChange('');
    toast.success('File uploaded successfully');
  };

  const handleRemoveFile = () => {
    onMediaFileChange(null);
    onMediaUrlChange('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const handleMediaTypeChange = (type: MediaType) => {
    onMediaTypeChange(type);
    handleRemoveFile();

    // ✅ Reset propre du timing quand on change de type
    if (type === 'none') {
      setUploadMethod('upload');
      setMediaUploadTiming('now');
    } else {
      setMediaUploadTiming('now');
    }
  };

  // ✅ Si l’utilisateur choisit "Later" -> on enlève tout fichier déjà sélectionné
  useEffect(() => {
    if (mediaType !== 'none' && mediaUploadTiming === 'later') {
      if (mediaFile || mediaUrl) {
        handleRemoveFile();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mediaUploadTiming]);

  return (
    <section className="space-y-6" aria-label="Lock Customization Form">
      <header>
        <h2 className="text-xl font-serif font-bold text-slate-900 flex items-center gap-2">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-sm font-sans text-slate-600">3</span>
          Personalize your Legacy
        </h2>
        <p className="text-slate-500 text-sm ml-10">
          Engrave your names and add digital memories to your asset.
        </p>
      </header>

      {/* --- MESSAGE CARD --- */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-3 border-b border-slate-50">
          <CardTitle className="text-lg text-slate-800">Engraving Details</CardTitle>
          <CardDescription>This text will appear in 3D AR on the bridge.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5 pt-5">
          <div className="space-y-2">
            <Label htmlFor="author-name" className="text-slate-700 font-semibold">
              Names or Initials <span className="text-[#e11d48]">*</span>
            </Label>
            <Input
              id="author-name"
              placeholder="Ex: Julie & Thomas"
              value={authorName}
              onChange={(e) => onAuthorNameChange(e.target.value)}
              maxLength={50}
              required
              className="bg-white border-slate-300 focus:border-[#e11d48] focus:ring-[#e11d48]"
            />
            <p className="text-xs text-slate-400">Visible on the lock face.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content-text" className="text-slate-700 font-semibold">
              Eternal Message <span className="text-[#e11d48]">*</span>
            </Label>
            <Textarea
              id="content-text"
              placeholder="Write your vow, a date, or a secret message..."
              value={contentText}
              onChange={(e) => onContentTextChange(e.target.value)}
              rows={3}
              maxLength={500}
              required
              className="bg-white border-slate-300 focus:border-[#e11d48] focus:ring-[#e11d48] resize-none"
            />
            <p className="text-xs text-slate-400 text-right">{contentText.length}/500 chars</p>
          </div>
        </CardContent>
      </Card>

      {/* --- VISIBILITY CARD (MONETIZATION) --- */}
      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <CardHeader className="pb-3 border-b border-slate-50 bg-slate-50/50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg text-slate-800">Asset Visibility</CardTitle>
              <CardDescription>Control who sees your content.</CardDescription>
            </div>
            <Lock className="text-slate-300 h-5 w-5" />
          </div>
        </CardHeader>
        <CardContent className="pt-5">
          <RadioGroup value={visibility} onValueChange={(value) => onVisibilityChange(value as 'Private' | 'For_Sale')}>
            {/* OPTION PRIVÉE */}
            <div
              className={`flex items-start space-x-3 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                visibility === 'Private' ? 'border-slate-400 bg-slate-50' : 'border-slate-100 hover:border-slate-200'
              }`}
            >
              <RadioGroupItem value="Private" id="visibility-private" className="mt-1 text-slate-600" />
              <div className="flex-1">
                <Label htmlFor="visibility-private" className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                  <EyeOff className="h-4 w-4" /> Private (Safe)
                </Label>
                <p className="text-xs text-slate-500 mt-1">Only you (and people with the password) can see the media content.</p>
              </div>
            </div>

            {/* OPTION MONÉTISÉE (VIRAL) */}
            <div
              className={`flex items-start space-x-3 p-4 rounded-xl border-2 transition-all cursor-pointer mt-3 ${
                visibility === 'For_Sale' ? 'border-[#e11d48] bg-rose-50' : 'border-slate-100 hover:border-slate-200'
              }`}
            >
              <RadioGroupItem value="For_Sale" id="visibility-sale" className="mt-1 text-[#e11d48]" />
              <div className="flex-1">
                <Label htmlFor="visibility-sale" className="flex items-center gap-2 cursor-pointer font-bold text-slate-900">
                  <DollarSign className="h-4 w-4 text-[#e11d48]" />
                  Monetize / Public
                  <span className="text-[10px] text-white bg-[#e11d48] px-2 py-0.5 rounded-full font-bold">EARN $2.99 / VIEW</span>
                </Label>
                <p className="text-xs text-slate-600 mt-1">
                  Tourists pay $4.99 to unlock your story. You earn $2.99 per view. Ideal for viral proposals or influencers.
                </p>
              </div>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* --- MEDIA CARD --- */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-3 border-b border-slate-50">
          <CardTitle className="text-lg text-slate-800">Add Digital Memory</CardTitle>
          <CardDescription>Upload a photo or video to be stored in the blockchain registry.</CardDescription>
        </CardHeader>
        <CardContent className="pt-5 space-y-6">
          <div className="grid gap-3 sm:grid-cols-4">
            {mediaOptions.map((option) => {
              const isSelected = mediaType === option.type;
              const Icon = option.icon;

              return (
                <button
                  key={option.type}
                  type="button"
                  onClick={() => handleMediaTypeChange(option.type)}
                  className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all hover:scale-105 ${
                    isSelected ? 'border-[#e11d48] bg-rose-50' : 'border-slate-100 hover:border-slate-300'
                  }`}
                >
                  {Icon && <Icon className={`h-6 w-6 ${isSelected ? 'text-[#e11d48]' : 'text-slate-400'}`} />}
                  <span className={`text-xs font-bold ${isSelected ? 'text-[#e11d48]' : 'text-slate-600'}`}>{option.label}</span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {MEDIA_PRICES[option.type] === 0 ? 'Free' : `+$${MEDIA_PRICES[option.type].toFixed(2)}`}
                  </span>
                </button>
              );
            })}
          </div>

          {/* ✅ NOUVEAU : CHOIX "UPLOAD NOW" OU "LATER" */}
          {mediaType !== 'none' && (
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
              <div className="flex items-start gap-3">
                <div className="bg-white p-2 rounded-lg border">
                  <Clock className="h-5 w-5 text-slate-600" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-800 text-sm">When do you want to upload your media?</p>
                  <p className="text-xs text-slate-500 mt-1">
                    You can upload now, or complete purchase first and add media later from your Dashboard.
                  </p>

                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <Button
                      type="button"
                      variant={mediaUploadTiming === 'now' ? 'default' : 'outline'}
                      onClick={() => setMediaUploadTiming('now')}
                      className={mediaUploadTiming === 'now' ? 'bg-slate-900 text-white' : 'bg-white text-slate-700'}
                    >
                      Upload Now
                    </Button>
                    <Button
                      type="button"
                      variant={mediaUploadTiming === 'later' ? 'default' : 'outline'}
                      onClick={() => setMediaUploadTiming('later')}
                      className={mediaUploadTiming === 'later' ? 'bg-slate-900 text-white' : 'bg-white text-slate-700'}
                    >
                      Later (Dashboard)
                    </Button>
                  </div>

                  {mediaUploadTiming === 'later' && (
                    <div className="mt-3 p-3 rounded-lg bg-white border border-slate-200 text-xs text-slate-600">
                      ✅ Your lock will be created now. You can add your {mediaType} later from <b>Dashboard → Upload Media</b>.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ✅ EXISTANT : Upload/camera UI — maintenant affiché seulement si "Upload Now" */}
          {mediaType !== 'none' && mediaUploadTiming === 'now' && (
            <div className="p-4 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50/50">
              <div className="flex gap-2 mb-4">
                <Button
                  type="button"
                  variant={uploadMethod === 'upload' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setUploadMethod('upload')}
                  className={`flex-1 ${uploadMethod === 'upload' ? 'bg-slate-900 text-white' : 'bg-white text-slate-700'}`}
                >
                  <Upload className="h-4 w-4 mr-2" /> Upload File
                </Button>

                {(mediaType === 'photo' || mediaType === 'video') && (
                  <Button
                    type="button"
                    variant={uploadMethod === 'camera' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setUploadMethod('camera')}
                    className={`flex-1 ${uploadMethod === 'camera' ? 'bg-slate-900 text-white' : 'bg-white text-slate-700'}`}
                  >
                    <Camera className="h-4 w-4 mr-2" /> Use Camera
                  </Button>
                )}
              </div>

              {uploadMethod === 'upload' && (
                <div className="space-y-2">
                  <input
                    ref={fileInputRef}
                    id="media-file"
                    type="file"
                    accept={getAcceptedFileTypes()}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-24 border-slate-300 border-dashed hover:bg-white hover:border-[#e11d48] transition-colors group"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="h-8 w-8 text-slate-400 group-hover:text-[#e11d48]" />
                      <span className="text-slate-500 group-hover:text-slate-700">Click to Select File</span>
                    </div>
                  </Button>
                </div>
              )}

              {uploadMethod === 'camera' && (
                <div className="space-y-2">
                  <input
                    ref={cameraInputRef}
                    id="media-camera"
                    type="file"
                    accept={getAcceptedFileTypes()}
                    capture={mediaType === 'photo' ? 'environment' : 'user'}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => cameraInputRef.current?.click()}
                    className="w-full h-24 border-slate-300 border-dashed hover:bg-white hover:border-[#e11d48]"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Camera className="h-8 w-8 text-slate-400" />
                      <span className="text-slate-500">Open Camera</span>
                    </div>
                  </Button>
                </div>
              )}

              {mediaFile && (
                <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg mt-4 animate-in fade-in">
                  <div className="bg-green-100 p-2 rounded-full">
                    <Checkbox checked disabled className="data-[state=checked]:bg-green-600 border-green-600" />
                  </div>
                  <div className="flex-1 truncate">
                    <p className="text-sm font-bold text-green-800">{mediaFile.name}</p>
                    <p className="text-xs text-green-600">{(mediaFile.size / 1024 / 1024).toFixed(2)} MB • Ready to upload</p>
                  </div>
                  <Button type="button" variant="ghost" size="icon" onClick={handleRemoveFile} className="text-slate-400 hover:text-red-500">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* --- LEGAL CHECK --- */}
      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-sm">
        <div className="flex items-start space-x-3 mb-3">
          <Checkbox
            id="terms-accepted"
            checked={termsAccepted}
            onCheckedChange={(checked) => onTermsAcceptedChange(checked as boolean)}
            className="mt-0.5 data-[state=checked]:bg-[#e11d48] border-slate-400"
          />
          <label htmlFor="terms-accepted" className="leading-tight cursor-pointer text-slate-600">
            I accept the <a href="/terms" className="underline hover:text-[#e11d48]">Terms of Service</a> and acknowledge this is a digital purchase.
          </label>
        </div>

        {(mediaType === 'photo' || mediaType === 'video') && (
          <div className="flex items-start space-x-3">
            <Checkbox
              id="image-rights"
              checked={imageRightsGranted}
              onCheckedChange={(checked) => onImageRightsGrantedChange(checked as boolean)}
              className="mt-0.5 data-[state=checked]:bg-[#e11d48] border-slate-400"
            />
            <label htmlFor="image-rights" className="leading-tight cursor-pointer text-slate-600">
              I own the rights to this media and authorize its display.
            </label>
          </div>
        )}
      </div>
    </section>
  );
}
