import { useId, useState, type ComponentProps } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { farmAuthInputClass } from "./FarmAuthLayout";

type AuthPasswordInputProps = Omit<ComponentProps<typeof Input>, "type"> & {
  id?: string;
};

export function AuthPasswordInput({ id: idProp, className, ...props }: AuthPasswordInputProps) {
  const uid = useId();
  const id = idProp ?? uid;
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-400/70" />
      <Input
        id={id}
        type={show ? "text" : "password"}
        className={cn(farmAuthInputClass, "pr-10", className)}
        {...props}
      />
      <button
        type="button"
        className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-md p-2 text-emerald-400/85 outline-none transition hover:bg-emerald-500/15 hover:text-emerald-100 focus-visible:ring-2 focus-visible:ring-emerald-400/45"
        onClick={() => setShow((s) => !s)}
        aria-label={show ? "Hide password" : "Show password"}
        aria-pressed={show}
      >
        {show ? <EyeOff className="h-4 w-4" aria-hidden /> : <Eye className="h-4 w-4" aria-hidden />}
      </button>
    </div>
  );
}
