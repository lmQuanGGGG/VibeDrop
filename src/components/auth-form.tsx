"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { Loader2, Mail, Lock, Eye, EyeOff, CheckCircle2, AlertTriangle } from "lucide-react";

export function AuthForm() {
  const router = useRouter();
  const supabase = createBrowserSupabaseClient();

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    // Client-side validations
    if (!email.trim() || !password.trim()) {
      setErrorMsg("Vui lòng nhập đầy đủ email và mật khẩu.");
      setIsLoading(false);
      return;
    }

    if (mode === "signup") {
      if (password.length < 6) {
        setErrorMsg("Mật khẩu phải chứa ít nhất 6 ký tự.");
        setIsLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg("Mật khẩu xác nhận không khớp.");
        setIsLoading(false);
        return;
      }
    }

    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) {
          setErrorMsg(
            error.message === "Invalid login credentials"
              ? "Email hoặc mật khẩu không chính xác."
              : error.message
          );
        } else {
          router.push("/");
          router.refresh();
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
        });

        if (error) {
          setErrorMsg(error.message);
        } else {
          if (data.session) {
            router.push("/");
            router.refresh();
          } else {
            setSuccessMsg(
              "Đăng ký thành công! Hãy kiểm tra hòm thư của bạn để xác nhận tài khoản."
            );
          }
        }
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Đã xảy ra lỗi hệ thống. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border-2 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative w-full">
      {/* Tabs */}
      <div className="flex border-b-2 border-black -mx-6 -mt-6 mb-6">
        <button
          type="button"
          onClick={() => {
            setMode("signin");
            setErrorMsg("");
            setSuccessMsg("");
          }}
          className={`w-1/2 py-3 text-center font-display font-black uppercase text-xs tracking-wider transition-all border-r-2 border-black cursor-pointer ${
            mode === "signin"
              ? "bg-[#c8f560] text-black"
              : "bg-white text-neutral-500 hover:text-black"
          }`}
        >
          Đăng nhập
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("signup");
            setErrorMsg("");
            setSuccessMsg("");
          }}
          className={`w-1/2 py-3 text-center font-display font-black uppercase text-xs tracking-wider transition-all cursor-pointer ${
            mode === "signup"
              ? "bg-[#c8f560] text-black"
              : "bg-white text-neutral-500 hover:text-black"
          }`}
        >
          Đăng ký
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Input */}
        <div>
          <label className="block font-mono text-[10px] font-black uppercase mb-1 text-black">
            Email
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-3 text-neutral-500">
              <Mail className="w-4 h-4" />
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              className="w-full bg-white border-2 border-black py-2 pl-9 pr-3 text-sm text-black font-medium focus:outline-none focus:bg-neutral-50 focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all rounded-none"
              required
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Password Input */}
        <div>
          <label className="block font-mono text-[10px] font-black uppercase mb-1 text-black">
            Mật khẩu
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-3 text-neutral-500">
              <Lock className="w-4 h-4" />
            </span>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-white border-2 border-black py-2 pl-9 pr-10 text-sm text-black font-medium focus:outline-none focus:bg-neutral-50 focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all rounded-none"
              required
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 text-neutral-500 hover:text-black cursor-pointer"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Confirm Password Input (Sign Up only) */}
        {mode === "signup" && (
          <div className="animate-rise-in">
            <label className="block font-mono text-[10px] font-black uppercase mb-1 text-black">
              Xác nhận mật khẩu
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-neutral-500">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white border-2 border-black py-2 pl-9 pr-3 text-sm text-black font-medium focus:outline-none focus:bg-neutral-50 focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all rounded-none"
                required
                disabled={isLoading}
              />
            </div>
          </div>
        )}

        {/* Error Notification */}
        {errorMsg && (
          <div className="flex items-start gap-2 bg-red-50 border-2 border-red-500 text-red-800 p-3 text-xs font-bold font-mono animate-rise-in">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Success Notification */}
        {successMsg && (
          <div className="flex items-start gap-2 bg-green-50 border-2 border-green-500 text-green-800 p-3 text-xs font-bold font-mono animate-rise-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2.5 bg-[#c8f560] text-black font-display font-black uppercase tracking-wider text-xs border-2 border-black hover:bg-[#b5e04b] transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] cursor-pointer disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
        >
          {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          {isLoading ? "Đang xử lý..." : mode === "signin" ? "Đăng nhập" : "Đăng ký"}
        </button>
      </form>
    </div>
  );
}
