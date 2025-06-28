import React from 'react';
import {
  Breadcrumbs as MuiBreadcrumbs,
  Link,
  Typography,
  Box
} from '@mui/material';
import { NavigateNext, Home } from '@mui/icons-material';
import { useNavigation } from '../../hooks/useNavigation';

const Breadcrumbs = () => {
  const { currentPath, goTo, getCurrentRouteName } = useNavigation();

  const generateBreadcrumbs = () => {
    const pathSegments = currentPath.split('/').filter(segment => segment);
    const breadcrumbs = [];

    // Add home breadcrumb
    breadcrumbs.push({
      label: 'Home',
      path: '/',
      icon: <Home fontSize="small" />
    });

    // Build breadcrumbs from path segments
    let currentPathBuilder = '';
    pathSegments.forEach((segment, index) => {
      currentPathBuilder += `/${segment}`;
      
      // Convert segment to readable label
      const label = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      breadcrumbs.push({
        label,
        path: currentPathBuilder,
        isLast: index === pathSegments.length - 1
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <Box sx={{ mb: 3 }}>
      <MuiBreadcrumbs
        separator={<NavigateNext fontSize="small" />}
        aria-label="breadcrumb"
      >
        {breadcrumbs.map((breadcrumb, index) => {
          if (breadcrumb.isLast) {
            return (
              <Typography
                key={breadcrumb.path}
                color="text.primary"
                sx={{ display: 'flex', alignItems: 'center' }}
              >
                {breadcrumb.icon}
                <span style={{ marginLeft: breadcrumb.icon ? 4 : 0 }}>
                  {breadcrumb.label}
                </span>
              </Typography>
            );
          }

          return (
            <Link
              key={breadcrumb.path}
              underline="hover"
              color="inherit"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                goTo(breadcrumb.path);
              }}
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                cursor: 'pointer',
                '&:hover': {
                  color: 'primary.main'
                }
              }}
            >
              {breadcrumb.icon}
              <span style={{ marginLeft: breadcrumb.icon ? 4 : 0 }}>
                {breadcrumb.label}
              </span>
            </Link>
          );
        })}
      </MuiBreadcrumbs>
    </Box>
  );
};

export default Breadcrumbs; 