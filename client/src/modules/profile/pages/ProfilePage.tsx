import { TwoFactorSetup } from "@/modules/auth/components/2faSetup";

export function ProfilePage() {
    return (
        <div>
            Profile
            <TwoFactorSetup />
        </div>
    );
}
