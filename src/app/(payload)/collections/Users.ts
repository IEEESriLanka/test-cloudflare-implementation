import { CollectionConfig, CollectionBeforeValidateHook, CollectionAfterChangeHook, CollectionBeforeChangeHook } from 'payload';
import { PROJECTS } from '../access/constants';
import { canManageUsers, filterUsersByProject, canSeeUserManagement } from '../access/checkRole';

/**
 * Hook to ensure Project Admins can only create/edit Project Managers for their own project.
 */
const validateUserRole: CollectionBeforeValidateHook = async ({ data, req: { user } }) => {
  if (user?.role === 'admin' || user?.role === 'manager') return data;

  if (user?.role === 'project-admin' && data) {
    // Force project to match the creator's project
    data.project = user.project;
    // Force role to project-manager (they can only manage PMs)
    data.role = 'project-manager';
  }

  return data;
};


const capturePassword: CollectionBeforeChangeHook = async ({ data, operation, req }) => {
  if (operation === 'create' && data.password && req) {
    // Store plain text password in req.context for afterChange hook
    // It's safe here because it's only for the duration of this request
    req.context.tempPassword = data.password;
  }
  return data;
};


const sendWelcomeEmail: CollectionAfterChangeHook = async ({ doc, req, operation }) => {
  if (operation === 'create') {
    const serverURL = process.env.NEXT_PUBLIC_SERVER_URL;
    if (!serverURL) {
      req.payload.logger.error('NEXT_PUBLIC_SERVER_URL is not defined in environment variables. Welcome email links will be broken.');
    }
    let roleMessage = '';
    
    switch (doc.role) {
      case 'admin':
        roleMessage = 'You have been granted <strong>Full Admin Access</strong>. You can manage all aspects of the website, including users, content, and system settings.';
        break;
      case 'manager':
        roleMessage = 'You have been granted <strong>Manager Access</strong>. You can manage website content and view user data.';
        break;
      case 'project-admin':
        roleMessage = `You have been granted <strong>Project Admin Access</strong> for <strong>${doc.project || 'your assigned project'}</strong>. You can manage content and members within your project.`;
        break;
      case 'project-manager':
        roleMessage = `You have been granted <strong>Project Manager Access</strong> for <strong>${doc.project || 'your assigned project'}</strong>. You can manage content within your project.`;
        break;
      default:
        roleMessage = 'You have been granted access to the IEEE YP Sri Lanka CMS.';
    }

    try {
      await req.payload.sendEmail({
        to: doc.email,
        from: 'ieeeypsl@gmail.com',
        subject: 'CMS Access Details - IEEE Young Professionals Sri Lanka Website',
        html: `
          <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 8px;">
            <div style="text-align: center; border-bottom: 2px solid #F37C28; padding-bottom: 20px; margin-bottom: 20px;">
               <h1 style="color: #002855; margin: 0;">Website Admin Panel Access</h1>
            </div>
            
            <p>Dear ${doc.name},</p>
            
            <p>You have been given admin access to the IEEE Young Professionals Sri Lanka website Admin Panel (CMS).</p>
            
            <div style="background-color: #f0f7ff; padding: 15px; border-radius: 5px; border-left: 4px solid #002855; margin: 20px 0;">
              ${roleMessage}
            </div>

            <p><strong>Please adhere to the following strict guidelines:</strong></p>
            <ul>
              <li><strong>Confidentiality:</strong> Your login credentials (username and password) are for your individual use only. Do not share them with anyone else.</li>
              <li><strong>Official Use Only:</strong> This access is granted strictly for official IEEE YP Sri Lanka work. Any unauthorized use is prohibited.</li>
            </ul>

            <p style="margin-top: 30px;">
              To access the system, please log in using your credentials at:
              <br>
              <a href="${serverURL}/admin" style="color: #F37C28; font-weight: bold; font-size: 16px;">${serverURL}/admin</a>
            </p>

            ${req.context.tempPassword ? `
            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 15px; border-radius: 5px; margin-top: 10px;">
              <p style="margin: 0; font-size: 14px; color: #64748b;">Initial Account Security Details:</p>
              <p style="margin: 5px 0 0 0;"><strong>Username:</strong> ${doc.email}</p>
              <p style="margin: 5px 0 0 0;"><strong>Initial Password:</strong> <code style="background: #e2e8f0; padding: 2px 6px; border-radius: 4px;">${req.context.tempPassword}</code></p>
            </div>
            ` : ''}

            <p>If you have any questions or did not request this access, please contact the IEEE YPSL MarCom Team immediately.</p>
            
            <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;">
            
            <p style="font-size: 12px; color: #666; text-align: center;">
              IEEE Young Professionals Sri Lanka<br>
              <a href="https://ieeeyp.lk/" style="color: #666;">www.ieeeyp.lk</a>
            </p>
          </div>
        `,
      });
      req.payload.logger.info(`Welcome email sent to ${doc.email}`);
      // Clean up the temporary password
      if (req.context) delete req.context.tempPassword;
    } catch (error) {
      req.payload.logger.error(`Failed to send welcome email to ${doc.email}: ${error}`);
    }
  }
  return doc;
};

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    forgotPassword: {
      generateEmailHTML: (args) => {
        const token = args?.token;
        const user = args?.user;
        const serverURL = process.env.NEXT_PUBLIC_SERVER_URL;
        
        if (!serverURL) {
          console.error('NEXT_PUBLIC_SERVER_URL is not defined. Password reset link will be broken.');
        }

        const resetPasswordURL = `${serverURL || ''}/admin/reset/${token}`;

        return `
          <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 8px;">
            <div style="text-align: center; border-bottom: 2px solid #F37C28; padding-bottom: 20px; margin-bottom: 20px;">
               <h1 style="color: #002855; margin: 0;">Reset Your Password</h1>
            </div>
            
            <p>Dear ${user?.name || 'User'},</p>
            
            <p>You are receiving this because you (or someone else) have requested the reset of the password for your account on the IEEE Young Professionals Sri Lanka Website Admin Panel.</p>
            
            <div style="background-color: #f0f7ff; padding: 15px; border-radius: 5px; border-left: 4px solid #002855; margin: 20px 0;">
              Please click on the button below to complete the process. If you did not request this, please ignore this email and your password will remain unchanged.
            </div>

            <p style="text-align: center; margin: 30px 0;">
              <a href="${resetPasswordURL}" style="background-color: #002855; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Reset My Password</a>
            </p>

            <p style="font-size: 14px; color: #666;">
              If the button above doesn't work, you can also copy and paste the following link into your browser:
              <br>
              <a href="${resetPasswordURL}" style="color: #F37C28; word-break: break-all;">${resetPasswordURL}</a>
            </p>
            
            <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;">
            
            <p style="font-size: 12px; color: #666; text-align: center;">
              IEEE Young Professionals Sri Lanka<br>
              <a href="https://ieeeyp.lk/" style="color: #666;">www.ieeeyp.lk</a>
            </p>
          </div>
        `;
      },
    },
  },
  admin: {
    useAsTitle: 'name',
    group: '6. Users',
    defaultColumns: ['name', 'email', 'project', 'role', 'lastLogin'],
    hidden: (user) => !canSeeUserManagement(user),
  },
  access: {
    read: filterUsersByProject,
    create: canManageUsers,
    update: filterUsersByProject,
    delete: filterUsersByProject,
  },
  hooks: {
    beforeValidate: [validateUserRole],
    beforeChange: [capturePassword],
    afterChange: [sendWelcomeEmail],
    afterLogin: [
      ({ user }) => {
        return user;
      },
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Manager', value: 'manager' },
        { label: 'Project Admin', value: 'project-admin' },
        { label: 'Project Manager', value: 'project-manager' },
      ],
      required: true,
    },
    {
      name: 'project',
      type: 'select',
      options: PROJECTS,
      admin: {
        condition: (data, siblingData, { user }) => {
          return user?.role === 'admin' || user?.role === 'manager';
        },
      },
    },
    {
      name: 'profilePicture',
      type: 'upload',
      relationTo: 'media',
      required: false,
      label: 'Profile Picture',
    },
    {
      name: 'lastLogin',
      type: 'date',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
  ],
};