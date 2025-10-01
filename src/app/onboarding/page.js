"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./onboarding.module.css";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    location: "",
    avatar: ""
  });
  const [avatarPreview, setAvatarPreview] = useState("");

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Go to next step
  const handleNextStep = (e) => {
    e.preventDefault();
    setStep(2);
  };

  // Go back to previous step
  const handleBackStep = () => {
    setStep(1);
  };

  // Handle final submit
  const handleFinalSubmit = (e) => {
    e.preventDefault();
    // Here you can send formData to your backend
    console.log("Form Submitted:", formData);
    router.push("/dashboard"); // redirect after submit
  };

  // Handle avatar upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
        setFormData({ ...formData, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Generate random avatar
  const generateRandomAvatar = () => {
    const randomId = Math.floor(Math.random() * 1000);
    const url = `https://i.pravatar.cc/150?img=${randomId}`;
    setAvatarPreview(url);
    setFormData({ ...formData, avatar: url });
  };

  return (
    <div className={styles.container}>
      <div className={styles.formsWrapper}>

        {/* Step 1 */}
        <form
          onSubmit={handleNextStep}
          className={styles.form}
          style={{
            transform: step === 1 ? "translateX(0)" : "translateX(-120%)",
            opacity: step === 1 ? 1 : 0,
            pointerEvents: step === 1 ? "auto" : "none"
          }}
        >
          <div className={styles.formBefore}></div>

          <h2 className={styles.title}>Complete Your Profile</h2>
          <p className={styles.subtitle}>Just a few more details to get you started</p>

          <div className={styles.inputGroup}>
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              className={styles.input}
              required
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className={styles.input}
              required
            />
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={formData.location}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>

          <button type="submit" className={styles.submitBtn}>Next</button>

          <div className={styles.progressIndicator}>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: "50%" }}></div>
            </div>
            <span className={styles.progressText}>Step 1 of 2</span>
          </div>
        </form>

        {/* Step 2 */}
        <form
          onSubmit={handleFinalSubmit}
          className={styles.form}
          style={{
            transform: step === 2 ? "translateX(0)" : "translateX(120%)",
            opacity: step === 2 ? 1 : 0,
            pointerEvents: step === 2 ? "auto" : "none"
          }}
        >
          <div className={styles.formBefore}></div>

          <div className={styles.arrowContainer}>
            <button type="button" onClick={handleBackStep} className={styles.arrowBtn}>
              &#8592; Back
            </button>
          </div>

          <h2 className={styles.title}>Choose Your Avatar</h2>
          <p className={styles.subtitle}>Upload a photo or generate a random avatar</p>

          <div className={styles.avatarSection}>
            <div className={styles.avatarPreview}>
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar" className={styles.avatarImage} />
              ) : (
                <div className={styles.avatarPlaceholder}></div>
              )}
            </div>

            <div className={styles.avatarButtons}>
              <label className={styles.uploadBtn}>
                <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                Upload Photo
              </label>

              <button type="button" onClick={generateRandomAvatar} className={styles.randomBtn}>
                Random Avatar
              </button>
            </div>
          </div>

          <button type="submit" className={styles.submitBtn}>Save & Continue</button>

          <div className={styles.progressIndicator}>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: "100%" }}></div>
            </div>
            <span className={styles.progressText}>Step 2 of 2</span>
          </div>
        </form>

      </div>
    </div>
  );
}
