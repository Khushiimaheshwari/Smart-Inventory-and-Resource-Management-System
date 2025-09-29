"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

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
  const [randomSeed, setRandomSeed] = useState(Math.random().toString(36).substring(7));

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (formData.fullName && formData.phone && formData.location) {
      setStep(2);
    }
  };

  const handleBackStep = () => {
    setStep(1);
  };

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

  const generateRandomAvatar = () => {
    const idx = Math.floor(Math.random() * 100) + 1;
    setRandomSeed(idx);
    const avatarUrl = `https://api.dicebear.com/7.x/adventurer/svg?seed=${idx}`;
    setAvatarPreview(avatarUrl);
    setFormData({ ...formData, avatar: avatarUrl });
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    
    // Replace with your API call
    console.log("Submitting:", formData);
    
    const res = await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      alert("Profile created successfully!");
      router.push("/profile");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formsWrapper}>
        {/* Step 1: User Details */}
        <form 
          onSubmit={handleNextStep} 
          style={{
            ...styles.form,
            transform: step === 1 ? 'translateX(0)' : 'translateX(-120%)',
            opacity: step === 1 ? 1 : 0,
            pointerEvents: step === 1 ? 'auto' : 'none'
          }}
        >
          <div style={styles.formBefore}></div>
          
          <div style={styles.arrowContainer}>
            <button
              type="button"
              style={{...styles.arrowBtn, opacity: 0.3, cursor: 'not-allowed'}}
              disabled>
            </button>
          </div>

          <h2 style={styles.title}>Complete Your Profile</h2>
          <p style={styles.subtitle}>Just a few more details to get you started</p>

          <div style={styles.inputGroup}>
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <input
              type="text"
              name="location"
              placeholder="Location (City, Country)"
              value={formData.location}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <button type="submit" style={styles.submitBtn}>
            Next
          </button>

          <div style={styles.progressIndicator}>
            <div style={styles.progressBar}>
              <div style={{...styles.progressFill, width: '50%'}}></div>
            </div>
            <span style={styles.progressText}>Step 1 of 2</span>
          </div>
        </form>

        {/* Step 2: Avatar Selection */}
        <form 
          onSubmit={handleFinalSubmit}
          style={{
            ...styles.form,
            transform: step === 2 ? 'translateX(0)' : 'translateX(120%)',
            opacity: step === 2 ? 1 : 0,
            pointerEvents: step === 2 ? 'auto' : 'none'
          }}
        >
          <div style={styles.formBefore}></div>
          
          <div style={styles.arrowContainer}>
            <button
              type="button"
              onClick={handleBackStep}
              style={styles.arrowBtn}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
            </button>
          </div>

          <h2 style={styles.title}>Choose Your Avatar</h2>
          <p style={styles.subtitle}>Upload a photo or generate a random avatar</p>

          <div style={styles.avatarSection}>
            <div style={styles.avatarPreview}>
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar" style={styles.avatarImage} />
              ) : (
                <div style={styles.avatarPlaceholder}>
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#a0aec0" strokeWidth="1.5">
                    <circle cx="12" cy="8" r="4"/>
                    <path d="M20 21a8 8 0 1 0-16 0"/>
                  </svg>
                </div>
              )}
            </div>

            <div style={styles.avatarButtons}>
              <label style={styles.uploadBtn}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{display: 'none'}}
                />
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight: '8px'}}>
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                Upload Photo
              </label>

              <button
                type="button"
                onClick={generateRandomAvatar}
                style={styles.randomBtn}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight: '8px'}}>
                  <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <circle cx="15.5" cy="8.5" r="1.5"/>
                  <circle cx="8.5" cy="15.5" r="1.5"/>
                  <circle cx="15.5" cy="15.5" r="1.5"/>
                </svg>
                Random Avatar
              </button>
            </div>
          </div>

          <button type="submit" style={styles.submitBtn}>
            Save & Continue
          </button>

          <div style={styles.progressIndicator}>
            <div style={styles.progressBar}>
              <div style={{...styles.progressFill, width: '100%'}}></div>
            </div>
            <span style={styles.progressText}>Step 2 of 2</span>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '92.5vh',
    display: 'flex',
    alignItems: 'start',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #e8f5f0 0%, #e1f3f8 100%)',
    padding: '20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    overflow: 'hidden',
  },
  formsWrapper: {
    position: 'relative',
    marginTop: '100px',
    width: '35%',
    
  },
  form: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    borderRadius: '20px',
    boxShadow: '0 15px 30px rgba(0, 201, 123, 0.08), 0 8px 20px rgba(0, 184, 217, 0.04), 0 0 0 1px rgba(255, 255, 255, 0.8)',
    padding: '32px',
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    overflow: 'hidden',
    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
  },
  formBefore: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #00c97b 0%, #00b8d9 100%)',
    borderRadius: '20px 20px 0 0'
  },
  arrowContainer: {
    marginBottom: '16px'
  },
  arrowBtn: {
    background: 'rgba(0, 201, 123, 0.1)',
    border: 'none',
    borderRadius: '50%',
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: '#00c97b',
    transition: 'all 0.3s ease'
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1d2b36',
    marginBottom: '8px',
    textAlign: 'center',
    letterSpacing: '-0.5px'
  },
  subtitle: {
    fontSize: '16px',
    color: '#666',
    textAlign: 'center',
    marginBottom: '28px',
    fontWeight: '400'
  },
  inputGroup: {
    marginBottom: '16px'
  },
  input: {
    width: '100%',
    padding: '14px 18px',
    border: '1.5px solid #e2e8f0',
    borderRadius: '12px',
    fontSize: '15px',
    background: 'rgba(255, 255, 255, 0.9)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    outline: 'none',
    color: '#2d3748',
    boxSizing: 'border-box'
  },
  avatarSection: {
    marginBottom: '24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px'
  },
  avatarPreview: {
    width: '140px',
    height: '140px',
    borderRadius: '50%',
    overflow: 'hidden',
    border: '3px solid #e2e8f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f7fafc'
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  avatarPlaceholder: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%'
  },
  avatarButtons: {
    display: 'flex',
    gap: '12px',
    width: '100%'
  },
  uploadBtn: {
    flex: 1,
    padding: '12px 16px',
    background: 'white',
    border: '1.5px solid #e2e8f0',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#2d3748'
  },
  randomBtn: {
    flex: 1,
    padding: '12px 16px',
    background: 'white',
    border: '1.5px solid #e2e8f0',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#2d3748'
  },
  submitBtn: {
    width: '100%',
    padding: '14px 16px',
    background: 'linear-gradient(135deg, #00c97b 0%, #00b8d9 100%)',
    border: 'none',
    borderRadius: '12px',
    color: 'white',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    letterSpacing: '0.3px',
    marginBottom: '20px'
  },
  progressIndicator: {
    textAlign: 'center'
  },
  progressBar: {
    width: '100%',
    height: '6px',
    background: '#e2e8f0',
    borderRadius: '3px',
    marginBottom: '8px',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #00c97b, #00b8d9)',
    borderRadius: '3px',
    transition: 'width 0.5s ease-out'
  },
  progressText: {
    fontSize: '13px',
    color: '#666',
    fontWeight: '500'
  }
};