import React from 'react'
import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';
import InfoIcon from '@mui/icons-material/Info';
import Person4Icon from '@mui/icons-material/Person4';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import CheckroomIcon from '@mui/icons-material/Checkroom';
import Man2Icon from '@mui/icons-material/Man2';
import WomanIcon from '@mui/icons-material/Woman';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';

const SidebarData = [

        {
            title: 'Home',
            icon: <HomeIcon />,
            path: '/'
        },
        {
            title: 'Login',
            icon: <LoginIcon />,
            path: '/login'
        },
        {
            title: 'Clothes',
            icon: <CheckroomIcon />,
            path: '/clothes',
            subItems: [
                { title: 'Men', icon: <Man2Icon />, path: '/clothes/men' },
                { title: 'Kids', icon: <FamilyRestroomIcon />, path: '/category/kids' },
                { title: 'Women', icon: <WomanIcon /> , path: '/clothes/women' }
                // { title: 'Gen Z', path: '/clothes/genz' }
            ]
        },
        {
            title: 'About',
            icon: <InfoIcon />,
            path: '/about'
        },
        {
            title: 'Setting',
            icon: <SettingsIcon />,
            path: '/setting'
        },
        {
            title: 'Profile',
            icon: <Person4Icon />,
            path: '/profile'
        },
        {
            title: 'Logout',
            icon: <LogoutIcon />,
            path: '/'
        }
    ]

  
export default SidebarData