import React from 'react'
import { useGeneralStore } from '../stores/generalstore'
import { useUserStore } from '../stores/userStore'
import { useForm } from '@mantine/form'

function ProfileSettings() {
    const isProfileSettingsModalOpen=useGeneralStore((state)=>state.isProfileSettingsModalOpen)
    const itoggleProfileSetting=useGeneralStore((state)=>state.toggleProfileSettingsModal)

    const profileimage=useUserStore((state)=>state.avatarUrl)

    const updateProfileImage=useUserStore((state)=>state.updateProfileImage)
    const username=useUserStore((state)=>state.fullname);
    const updateusername=useUserStore((state)=>state.updateUsername)

    const form=useForm({
        initialValues:{
            username: username,
            profileimage: profileimage
        },
        validate:{
            username:(value:string)=>value.trim().length>=3 ? null :"username must be at least 3 characters"
        }
    })

    

  return (
    <div>ProfileSettings</div>
  )
}

export default ProfileSettings