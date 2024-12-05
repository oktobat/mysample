import React from 'react';
import { useSelector } from 'react-redux'
import MemberModifyForm from '@/components/member/MemberModifyForm'

const MemberModifyView = () => {
  const user = useSelector(state=>state.member.user)
  return (
    <div>
      <MemberModifyForm memberVo={user} />
    </div>
  );
};

export default MemberModifyView;