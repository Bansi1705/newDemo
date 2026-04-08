import type { OtpProps } from "../../types";

export const Otp: React.FC<OtpProps> = ({ otpValue, setOtpValue }) => {
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
