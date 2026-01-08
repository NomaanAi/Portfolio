
import Project from '../models/Project.model.js';
import Skill from '../models/Skill.js';
import Experience from '../models/Experience.js';

export const validateChatbotReadiness = async () => {
    try {
        const [projectCount, skillCount, experienceCount] = await Promise.all([
            Project.countDocuments(),
            Skill.countDocuments(),
            Experience.countDocuments()
        ]);

        // Define threshold for "readiness"
        const isReady = projectCount > 0 || skillCount > 0 || experienceCount > 0;

        return {
            isReady,
            details: {
                projects: projectCount,
                skills: skillCount,
                experience: experienceCount
            },
            missing: {
                projects: projectCount === 0,
                skills: skillCount === 0,
                experience: experienceCount === 0
            }
        };
    } catch (error) {
        console.error("Error validating chatbot readiness:", error);
        // Fail open or closed? Let's fail safe (assume not ready if error)
        return { isReady: false, error: true };
    }
};
