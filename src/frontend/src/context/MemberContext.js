import { createContext, useState } from "react";

const MemberContext = createContext();

export const MemberInfo = ({ children }) => {
    const [memberData, setMemberData] = useState({
        token: null,
        user: null,
    });

    const updateMemberData = (data) => {
        setMemberData({
            token: data.token,
            user: data.user,
        });
    };

    return (
        <MemberContext.Provider value={{ memberData, updateMemberData }}>
            {children}
        </MemberContext.Provider>
    );
};

export default MemberContext;