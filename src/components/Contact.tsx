import { useState } from "react";
import { motion, Variants } from "framer-motion";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Send } from "lucide-react";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  message: z.string().trim().min(1, "Message is required").max(1000, "Message must be less than 1000 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 40, clipPath: "inset(100% 0% 0% 0%)" },
    visible: {
      opacity: 1,
      y: 0,
      clipPath: "inset(0% 0% 0% 0%)",
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const labelVariants: Variants = {
    unfocused: { y: 0, scale: 1, color: "hsl(var(--muted-foreground))" },
    focused: { y: -28, scale: 0.85, color: "hsl(var(--primary))" },
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof ContactFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const result = contactSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ContactFormData, string>> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof ContactFormData] = err.message;
        }
      });
      setErrors(fieldErrors);
      setIsSubmitting(false);
      return;
    }

    // Simulate submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: "Message sent!",
      description: "Thanks for reaching out. I'll get back to you soon.",
    });

    setFormData({ name: "", email: "", message: "" });
    setIsSubmitting(false);
  };

  const isFieldActive = (field: keyof ContactFormData) => {
    return focusedField === field || formData[field].length > 0;
  };

  return (
    <section id="contact" className="bg-background py-24 md:py-32 px-6 md:px-10">
      <motion.div
        className="max-w-2xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {/* Header */}
        <motion.div className="mb-12" variants={itemVariants}>
          <h5 className="text-sm uppercase text-muted-foreground mb-3">(Get in Touch)</h5>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Let's work together
          </h2>
        </motion.div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Name Field */}
          <motion.div className="relative" variants={itemVariants}>
            <motion.label
              htmlFor="name"
              className="absolute left-0 top-4 text-sm uppercase tracking-wider pointer-events-none origin-left"
              variants={labelVariants}
              animate={isFieldActive("name") ? "focused" : "unfocused"}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              Your Name
            </motion.label>
            <motion.input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onFocus={() => setFocusedField("name")}
              onBlur={() => setFocusedField(null)}
              className="w-full bg-transparent border-b-2 border-border py-4 text-foreground text-lg focus:outline-none focus:border-primary transition-colors duration-300"
              whileFocus={{ borderColor: "hsl(var(--primary))" }}
            />
            {errors.name && (
              <motion.p
                className="text-destructive text-sm mt-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {errors.name}
              </motion.p>
            )}
          </motion.div>

          {/* Email Field */}
          <motion.div className="relative" variants={itemVariants}>
            <motion.label
              htmlFor="email"
              className="absolute left-0 top-4 text-sm uppercase tracking-wider pointer-events-none origin-left"
              variants={labelVariants}
              animate={isFieldActive("email") ? "focused" : "unfocused"}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              Your Email
            </motion.label>
            <motion.input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField(null)}
              className="w-full bg-transparent border-b-2 border-border py-4 text-foreground text-lg focus:outline-none focus:border-primary transition-colors duration-300"
            />
            {errors.email && (
              <motion.p
                className="text-destructive text-sm mt-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {errors.email}
              </motion.p>
            )}
          </motion.div>

          {/* Message Field */}
          <motion.div className="relative" variants={itemVariants}>
            <motion.label
              htmlFor="message"
              className="absolute left-0 top-4 text-sm uppercase tracking-wider pointer-events-none origin-left"
              variants={labelVariants}
              animate={isFieldActive("message") ? "focused" : "unfocused"}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              Your Message
            </motion.label>
            <motion.textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              onFocus={() => setFocusedField("message")}
              onBlur={() => setFocusedField(null)}
              rows={4}
              className="w-full bg-transparent border-b-2 border-border py-4 text-foreground text-lg focus:outline-none focus:border-primary transition-colors duration-300 resize-none"
            />
            {errors.message && (
              <motion.p
                className="text-destructive text-sm mt-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {errors.message}
              </motion.p>
            )}
          </motion.div>

          {/* Submit Button */}
          <motion.div variants={itemVariants}>
            <motion.button
              type="submit"
              disabled={isSubmitting}
              className="group flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-full text-sm uppercase font-semibold tracking-wider disabled:opacity-50"
              whileHover={{ scale: 1.02, boxShadow: "0 0 40px hsl(var(--primary) / 0.4)" }}
              whileTap={{ scale: 0.98 }}
            >
              <span>{isSubmitting ? "Sending..." : "Send Message"}</span>
              <motion.span
                animate={{ x: isSubmitting ? 10 : 0 }}
                transition={{ repeat: isSubmitting ? Infinity : 0, repeatType: "reverse", duration: 0.5 }}
              >
                <Send size={16} />
              </motion.span>
            </motion.button>
          </motion.div>
        </form>
      </motion.div>
    </section>
  );
};

export default Contact;
