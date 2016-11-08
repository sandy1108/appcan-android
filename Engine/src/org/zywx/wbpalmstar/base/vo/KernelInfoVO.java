/*
 * Copyright (c) 2016.  The AppCan Open Source Project.
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Lesser General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Lesser General Public License for more details.
 *
 *  You should have received a copy of the GNU Lesser General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 *
 */

package org.zywx.wbpalmstar.base.vo;

import java.io.Serializable;

public class KernelInfoVO implements Serializable {

    private static final long serialVersionUID = -8845713753524015456L;
    private String kernelType;
    private String kernelVersion;

    public String getKernelType() {
        return kernelType;
    }

    public void setKernelType(String type) {
        this.kernelType = type;
    }

    public String getKernelVersion() {
        return kernelVersion;
    }

    public void setKernelVersion(String version) {
        this.kernelVersion = version;
    }
}
