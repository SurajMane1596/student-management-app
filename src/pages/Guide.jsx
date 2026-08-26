import { LogIn, Users, UserPlus, UserCog, BookOpen } from "lucide-react";
import { PageHeading, SectionCard } from "../components/ui/Atoms";

const STEPS = [
  {
    icon: LogIn,
    title: "Signing in",
    body: "Use the Client Id issued to you along with your registered mobile number and password to log in. All three fields are required.",
  },
  {
    icon: UserCog,
    title: "Managing your profile",
    body: "Open View Profile from the menu to see your account details. Tap Edit Profile to update your name, contact number, email or client name.",
  },
  {
    icon: Users,
    title: "Viewing customers",
    body: "View Customer lists every student record you've added. Tap the pencil icon on any row to edit that student's details.",
  },
  {
    icon: UserPlus,
    title: "Adding a customer",
    body: "Tap Add Customer to open the student form. Fill in the student, parent, medical, address and school sections — fields marked with * are mandatory.",
  },
];

export default function Guide() {
  return (
    <div className="max-w-2xl">
      <PageHeading
        title="Guide"
        subtitle="A quick walkthrough of the app's features"
      />

      <div className="space-y-4">
        {STEPS.map(({ icon: Icon, title, body }) => (
          <SectionCard key={title}>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                <Icon size={19} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">{title}</h3>
                <p className="text-sm text-slate-500 mt-1 leading-relaxed">{body}</p>
              </div>
            </div>
          </SectionCard>
        ))}

        <div className="flex items-center gap-2 text-xs text-slate-400 justify-center pt-2">
          <BookOpen size={14} />
          Need more help? Visit Contact Us from the menu.
        </div>
      </div>
    </div>
  );
}
