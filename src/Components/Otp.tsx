interface OtpProps {
  otpValue: string;
  setOtpValue: (value: string) => void;
}

export const Otp = ({ otpValue, setOtpValue }:OtpProps) => {
  return (
    <input
      type="text"
      name="otp"
      value={otpValue}
      onChange={(e) => setOtpValue(e.target.value)}
      placeholder="Enter OTP"
      className="form-input"
    />
  );
};