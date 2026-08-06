import React, { useRef, useState } from 'react';
import { Upload, Link2, X, ImageOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { uploadImage, errorMessage } from '../../lib/api';
import { imageUrl } from '../../lib/media';

const MAX_MB = 10;

/**
 * One image, two ways to set it: upload a file, or paste a URL.
 *
 * The value is always `{ url, publicId }`. `publicId` is present only for files
 * we uploaded to Cloudinary, which is how the backend knows whether deleting
 * the record should also delete the asset - a pasted URL may be someone else's
 * image and must never be touched.
 */
const ImageField = ({ label = 'Image', value, onChange, hint }) => {
  const fileInput = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [broken, setBroken] = useState(false);

  const current = imageUrl(value);

  const handleFile = async (event) => {
    const file = event.target.files?.[0];
    // Let the same file be picked again after a failure.
    event.target.value = '';
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please choose an image file.');
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      toast.error(`Images must be under ${MAX_MB} MB.`);
      return;
    }

    setUploading(true);
    setProgress(0);
    try {
      const uploaded = await uploadImage(file, setProgress);
      setBroken(false);
      onChange(uploaded);
      toast.success('Image uploaded');
    } catch (err) {
      toast.error(errorMessage(err, 'Upload failed.'));
    } finally {
      setUploading(false);
    }
  };

  const handleUrl = (event) => {
    setBroken(false);
    // Typing a URL clears any publicId: this is no longer our uploaded asset.
    onChange({ url: event.target.value, publicId: null });
  };

  return (
    <div className="space-y-3">
      <Label className="text-[#f5f5f0]/70 font-mono text-xs tracking-wider uppercase">
        {label}
      </Label>

      <div className="flex gap-4">
        <div className="w-32 h-20 rounded-lg bg-[#0a0a0a] border border-[#f5f5f0]/10 overflow-hidden flex-shrink-0 flex items-center justify-center">
          {current && !broken ? (
            <img
              src={current}
              alt=""
              className="w-full h-full object-cover"
              onError={() => setBroken(true)}
            />
          ) : (
            <ImageOff className="w-5 h-5 text-[#f5f5f0]/20" />
          )}
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={uploading}
              onClick={() => fileInput.current?.click()}
              className="border-[#f5f5f0]/20 text-[#f5f5f0] hover:bg-[#f5f5f0]/10"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {progress}%
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </>
              )}
            </Button>
            {current && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setBroken(false);
                  onChange({ url: '', publicId: null });
                }}
                className="text-[#f5f5f0]/50 hover:text-red-400"
              >
                <X className="w-4 h-4 mr-1" />
                Clear
              </Button>
            )}
          </div>

          <div className="relative">
            <Link2 className="w-4 h-4 text-[#f5f5f0]/30 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              value={current}
              onChange={handleUrl}
              placeholder="…or paste an image URL"
              className="bg-[#0a0a0a] border-[#f5f5f0]/10 text-[#f5f5f0] pl-9"
            />
          </div>
        </div>
      </div>

      {broken && current && (
        <p className="text-amber-400/80 text-xs">
          This URL did not load. Check the address, or upload the file instead.
        </p>
      )}
      {hint && <p className="text-[#f5f5f0]/40 text-xs">{hint}</p>}

      <input
        ref={fileInput}
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="hidden"
      />
    </div>
  );
};

export default ImageField;
