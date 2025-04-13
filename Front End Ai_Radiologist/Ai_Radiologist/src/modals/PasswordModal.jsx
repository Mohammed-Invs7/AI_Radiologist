import { motion } from 'framer-motion';

const PasswordModal = ({
    show,
    new_password1,
    new_password2,
    passwordMessage,
    onClose,
    onSave,
    setNewPassword1,
    setNewPassword2
}) => {
    if (!show) return null;

    const handleClose = () => {
        setNewPassword1("");
        setNewPassword2("");
        onClose();
    };

    return (
        <motion.div 
            className="modal fade show d-block"
            tabIndex="-1"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Change Password</h5>
                        <button type="button" className="btn-close" onClick={handleClose}></button>
                    </div>
                    <div className="modal-body">
                        <div className="mb-3">
                            <label>New Password</label>
                            <input
                                type="password"
                                className="form-control"
                                value={new_password1}
                                onChange={(e) => setNewPassword1(e.target.value)} 
                            />
                        </div>
                        <div className="mb-3">
                            <label>Confirm Password</label>
                            <input
                                type="password"
                                className="form-control"
                                value={new_password2}
                                onChange={(e) => setNewPassword2(e.target.value)} 
                            />
                        </div>
                        {passwordMessage && <div className="alert alert-info">{passwordMessage}</div>}
                    </div>
                    <div className="modal-footer d-flex justify-content-center align-items-center text-center">
                        <motion.button className="btn btn-danger w-75 " onClick={onSave} whileHover={{ scale: 1.1 }}>
                            Save Changes
                        </motion.button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default PasswordModal;
