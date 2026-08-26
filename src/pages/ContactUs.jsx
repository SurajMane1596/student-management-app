import { User, Phone, Mail } from "lucide-react";
import { PageHeading, SectionCard } from "../components/ui/Atoms";
import { CONTACT_INFO } from "../data/masterData";

export default function ContactUs() {
  return (
    <div className="max-w-md">
      <PageHeading title="Contact Us" subtitle="Reach out to our support team" />

      <SectionCard>
        <div className="space-y-5">
          <ContactRow icon={User} label="Contact Person" value={CONTACT_INFO.contactPerson} />
          <ContactRow
            icon={Phone}
            label="Contact Number"
            value={CONTACT_INFO.contactNumber}
            href={`tel:${CONTACT_INFO.contactNumber}`}
          />
          <ContactRow
            icon={Mail}
            label="Email Id"
            value={CONTACT_INFO.email}
            href={`mailto:${CONTACT_INFO.email}`}
          />
        </div>
      </SectionCard>
    </div>
  );
}

function ContactRow({ icon: Icon, label, value, href }) {
  const content = (
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
        <Icon size={18} />
      </div>
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-sm font-medium text-slate-800">{value}</p>
      </div>
    </div>
  );

  return href ? (
    <a href={href} className="block hover:opacity-80 transition-opacity">
      {content}
    </a>
  ) : (
    content
  );
}
