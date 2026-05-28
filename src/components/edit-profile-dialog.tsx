"use client";

import { useRef, useState } from "react";
import { Camera, X, Loader2 } from "lucide-react";
import { uploadImageToR2 } from "@/lib/upload-r2";
import { updateProfile } from "@/lib/actions/profile";

type Profile = {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
};

type EditProfileDialogProps = {
  profile: Profile;
};

export function EditProfileDialog({ profile }: EditProfileDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [displayName, setDisplayName] = useState(profile.display_name || "");
  const [bio, setBio] = useState(profile.bio || "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  
  const defaultAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.display_name || profile.username}`;
  const [avatarPreview, setAvatarPreview] = useState(profile.avatar_url || defaultAvatar);

  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleOpen = () => {
    setDisplayName(profile.display_name || "");
    setBio(profile.bio || "");
    setAvatarFile(null);
    setAvatarPreview(profile.avatar_url || defaultAvatar);
    setErrorMsg("");
    dialogRef.current?.showModal();
  };

  const handleClose = () => {
    dialogRef.current?.close();
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (e.g. 2MB max)
      if (file.size > 2 * 1024 * 1024) {
        setErrorMsg("File is too large. Maximum size is 2MB.");
        return;
      }
      // Validate mime type
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        setErrorMsg("Invalid file type. Only JPEG, PNG, and WebP are allowed.");
        return;
      }

      setErrorMsg("");
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMsg("");

    try {
      let finalAvatarUrl = profile.avatar_url;

      if (avatarFile) {
        setIsUploading(true);
        const { publicUrl } = await uploadImageToR2(avatarFile, "avatars");
        finalAvatarUrl = publicUrl;
        setIsUploading(false);
      }

      const formData = new FormData();
      formData.append("displayName", displayName);
      formData.append("bio", bio);
      formData.append("avatarUrl", finalAvatarUrl || "");

      await updateProfile(formData);
      handleClose();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to update profile. Please try again.");
    } finally {
      setIsUploading(false);
      setIsSaving(false);
    }
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className="px-4 py-2 border-2 border-black bg-white hover:bg-neutral-50 text-xs font-mono font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2 transition-all cursor-pointer"
      >
        Edit Profile
      </button>

      <dialog
        ref={dialogRef}
        className="fixed inset-0 m-auto w-[90%] max-w-md bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none z-50 text-black focus-visible:outline-none backdrop:bg-black/70 backdrop:backdrop-blur-[2px]"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b-2 border-black mb-6">
            <h2 className="font-display font-black text-xl uppercase tracking-wider">
              Edit Profile
            </h2>
            <button
              onClick={handleClose}
              className="hover:bg-neutral-100 p-1 border-2 border-transparent hover:border-black transition-all cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Avatar upload group */}
            <div className="flex flex-col items-center">
              <div
                onClick={handleAvatarClick}
                className="relative w-28 h-28 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group cursor-pointer overflow-hidden bg-neutral-50 hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                <img
                  src={avatarPreview}
                  alt="Avatar preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-1 select-none">
                  <Camera className="w-6 h-6" />
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider">
                    Change Photo
                  </span>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
              <span className="font-mono text-[9px] text-neutral-500 uppercase font-bold mt-2">
                JPG, PNG or WebP. Max 2MB.
              </span>
            </div>

            {/* Display Name Input */}
            <div>
              <label className="block font-mono text-xs font-bold uppercase mb-1 text-black">
                Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                maxLength={50}
                placeholder="Enter display name"
                className="w-full bg-white border-2 border-black p-2.5 text-sm rounded-none text-black font-medium focus:outline-none focus:bg-neutral-50 focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
              />
            </div>

            {/* Bio Input */}
            <div>
              <label className="block font-mono text-xs font-bold uppercase mb-1 text-black flex justify-between">
                <span>Bio</span>
                <span className="text-neutral-500">{bio.length}/160</span>
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={160}
                rows={3}
                placeholder="Tell us about yourself..."
                className="w-full bg-white border-2 border-black p-2.5 text-sm rounded-none text-black font-medium focus:outline-none focus:bg-neutral-50 focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all resize-none"
              />
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="bg-red-50 border-2 border-red-500 text-red-700 p-3 text-xs font-bold font-mono">
                {errorMsg}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t-2 border-black">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSaving || isUploading}
                className="w-1/2 py-2.5 bg-white text-black font-display font-black uppercase tracking-wider text-xs border-2 border-black hover:bg-neutral-50 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving || isUploading}
                className="w-1/2 py-2.5 bg-[#c8f560] text-black font-display font-black uppercase tracking-wider text-xs border-2 border-black hover:bg-[#b5e04b] transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] cursor-pointer disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
              >
                {(isSaving || isUploading) && (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                )}
                {isUploading ? "Uploading..." : isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
}
