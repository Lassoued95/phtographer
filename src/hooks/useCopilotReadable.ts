import { useCopilotReadable } from "@copilotkit/react-core";
import { businessInfo, getBusinessContext } from "../data/businessInfo";

export const useBusinessInfo = () => {
  // Make business information readable by CopilotKit
  useCopilotReadable({
    description: "Complete business information for Djerba Lens photography services",
    value: businessInfo,
  });

  // Make business context readable
  useCopilotReadable({
    description: "Business context and instructions for the AI assistant",
    value: getBusinessContext(),
  });

  // Make specific contact info easily accessible
  useCopilotReadable({
    description: "Contact information for Djerba Lens",
    value: {
      email: businessInfo.contact.email,
      phone: businessInfo.contact.phone,
      whatsapp: businessInfo.contact.whatsapp,
      instagram: businessInfo.contact.instagram,
      location: businessInfo.location,
      responseTime: businessInfo.contact.responseTime
    },
  });

  // Make services information easily accessible
  useCopilotReadable({
    description: "Photography services offered by Djerba Lens",
    value: businessInfo.services,
  });

  // Make packages information easily accessible
  useCopilotReadable({
    description: "Photography packages offered by Djerba Lens",
    value: businessInfo.packages,
  });

  // Make FAQ easily accessible
  useCopilotReadable({
    description: "Frequently asked questions about Djerba Lens services",
    value: businessInfo.faq,
  });
};